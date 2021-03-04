export interface CommandInterface {
  run(...args: any[]): Promise<number | void>;
}
