import * as Express from 'express';
import { Server } from 'net';
import { ModuleInterface } from '../App';
import { App } from '../App/App';
import {
  createExpressServer,
  useContainer,
} from '../proxy/routing-controllers';
import Container, { Token } from '../proxy/typedi';
import { HasControllers } from './HasControllers';
import { HasMiddlewares } from './HasMiddlewares';
import { HttpModule } from './HttpModule';

/**
 * Names of services registered by the HTTP Application.
 */
export const HttpServices = {
  ExpressApp: new Token<Express.Application>('express_app'),
  ExpressServer: new Token<Server>('express_server'),
};

/**
 * Application that handles incoming HTTP traffic.
 *
 * Uses Express server and routing-controllers.
 */
export class HttpApp extends App {
  private readonly expressApp: Express.Application;

  private server: Server;

  constructor(rootDir: string, modules: ModuleInterface[] = []) {
    super(rootDir, [new HttpModule(), ...modules]);

    useContainer(Container);

    this.expressApp = createExpressServer({
      controllers: this.loadControllers(),
      middlewares: this.loadMiddlewares(),
    });
    Container.set(HttpServices.ExpressApp, this.expressApp);

    const routes: string[] = this.expressApp._router.stack.reduce(
      (routes, middleware) => {
        if (!middleware.route) {
          return routes;
        }

        const { method } = middleware.route.stack[0];
        const { path } = middleware.route;

        return [...routes, `${method.toUpperCase()} ${path}`];
      },
      [],
    );

    this.logger.debug('Loaded HTTP routes', { data: routes });
  }

  /**
   * Start the application and therefore the HTTP server.
   */
  public async start(): Promise<Server> {
    await super.start();

    const port = this.config.get<number>('http.port');
    return new Promise((resolve) => {
      this.server = this.expressApp.listen(port, () => {
        this.logger.info(`HTTP server listening on port :${port}`);
        resolve(this.server);
      });
      Container.set(HttpServices.ExpressServer, this.server);
    });
  }

  /**
   * Load controllers from all modules that provide them.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  private loadControllers(): Function[] {
    // instanceof Interface checker
    const hasControllers = (mod: any): mod is HasControllers => {
      return 'loadControllers' in mod;
    };

    const controllerProviders: HasControllers[] = this.modules.filter(
      hasControllers,
    ) as any[];

    return controllerProviders.reduce((controllers, mod: HasControllers) => {
      return [...controllers, ...mod.loadControllers(this.config)];
    }, []);
  }

  /**
   * Load middlewares from all modules that provide them.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  private loadMiddlewares(): Function[] {
    // instanceof Interface checker
    const hasMiddlewares = (mod: any): mod is HasMiddlewares => {
      return 'loadMiddlewares' in mod;
    };

    const middlewareProviders: HasMiddlewares[] = this.modules.filter(
      hasMiddlewares,
    ) as any[];

    return middlewareProviders.reduce((middlewares, mod: HasMiddlewares) => {
      return [...middlewares, ...mod.loadMiddlewares(this.config)];
    }, []);
  }
}
