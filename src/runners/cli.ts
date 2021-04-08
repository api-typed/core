import { App } from '@api-typed/app';
import requireApp from '../lib/requireApp';

export default async (appFile: string): Promise<void> => {
  const app = requireApp(appFile) as App;
  try {
    await app.start('command');
  } catch (e) {
    console.error(e);
  }
};
