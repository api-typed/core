import { globRequire } from './globRequire';

// eslint-disable-next-line @typescript-eslint/ban-types
export const loadCommands = (pattern: string): Function[] => {
  return Object.values(globRequire(pattern));
};
