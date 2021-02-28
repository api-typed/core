import { load as loadBootstrap } from '../Bootstrap/load';
import { HttpApp } from './HttpApp';

const bootstrap = loadBootstrap(true);
const app = new HttpApp(bootstrap.rootDir, bootstrap.modules);
app.start();
