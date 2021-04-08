import { App } from '@api-typed/app';

export default (appFile: string): App => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require(appFile).default;

  if (!(app instanceof App)) {
    throw new Error(
      `App file "${appFile} did not export instance of App as a default.`,
    );
  }

  return app;
};
