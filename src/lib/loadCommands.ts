import { globRequire } from './globRequire';

export const loadCommands = (pattern: string): Function[] => {
  return Object.values(globRequire(pattern));
};
