import { globRequire } from './globRequire';

// eslint-disable-next-line @typescript-eslint/ban-types
export const loadControllers = (pattern: string): Function[] => {
  return Object.values(globRequire(pattern));
};
