export type ClassName<T> = {
  new (...args: any[]): T;
};
