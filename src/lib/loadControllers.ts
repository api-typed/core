import * as glob from 'glob';

/**
 * Load controllers based on the given glob pattern.
 *
 * @param pattern glob pattern on where to find controllers.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const loadControllers = (pattern: string): Function[] => {
  return glob.sync(pattern, { nodir: true }).reduce((controllers, file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ctrls = require(file);
    return [...controllers, ...Object.values(ctrls)];
  }, []);
};
