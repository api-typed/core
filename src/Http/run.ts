import { load as loadBootstrap } from '../Bootstrap/load';
import { HttpApp } from './HttpApp';

const bootstrap = loadBootstrap();
const app = new HttpApp(bootstrap.rootDir, bootstrap.modules);
app.start();
