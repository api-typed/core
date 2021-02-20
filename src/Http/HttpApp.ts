import * as Express from 'express';
import { Server } from 'net';
import { App } from '../App';
import { AppModule } from '../AppModule';
import {
  createExpressServer,
  useContainer,
} from '../proxy/routing-controllers';
import Container, { Token } from '../proxy/typedi';
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

  constructor(rootDir: string, modules: AppModule[] = []) {
    super(rootDir, [new HttpModule(), ...modules]);

    useContainer(Container);

    // load controllers from all registered modules
    const controllers = this.modules.reduce((controllers, mod) => {
      return [...controllers, ...mod.loadControllers(this.config)];
    }, []);

    this.expressApp = createExpressServer({
      controllers,
    });
    Container.set(HttpServices.ExpressApp, this.expressApp);
  }

  /**
   * Start the application and therefore the HTTP server.
   */
  public async start(): Promise<Server> {
    return new Promise((resolve) => {
      this.server = this.expressApp.listen(
        this.config.get<number>('http.port'),
        () => resolve(this.server),
      );
      Container.set(HttpServices.ExpressServer, this.server);
    });
  }
}
