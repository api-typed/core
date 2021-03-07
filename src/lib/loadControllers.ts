import { globRequire } from './globRequire';

export const loadControllers = (pattern: string): Function[] => {
  return Object.values(globRequire(pattern));
};
