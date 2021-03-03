import { load as loadBootstrap } from '../Bootstrap/load';
import { CommandApp } from './CommandApp';

const bootstrap = loadBootstrap(true);
const app = new CommandApp(bootstrap.rootDir, bootstrap.modules);
app.start();
