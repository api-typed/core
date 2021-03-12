import { App, AppRunMode } from '../App';
import requireApp from '../lib/requireApp';

export default async (appFile: string): Promise<void> => {
  const app = requireApp(appFile) as App;
  try {
    await app.start(AppRunMode.Command);
  } catch (e) {
    console.error(e);
  }
};
