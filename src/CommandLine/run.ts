import { load as loadBootstrap } from '../Bootstrap/load';
import { CommandLineApp } from './CommandLineApp';

const bootstrap = loadBootstrap(true);
const app = new CommandLineApp(bootstrap.rootDir, bootstrap.modules);
app.start();
