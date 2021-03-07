import { globRequire } from './globRequire';

export const loadMiddlewares = (pattern: string): Function[] => {
  return Object.values(globRequire(pattern));
};
