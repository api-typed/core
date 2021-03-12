import { CommandOption } from '../types';

interface CommandDescription {
  target: Function;
  signature: string;
  description?: string;
  options?: Record<string, CommandOption | string>;
}

const registry: CommandDescription[] = [];

export const getRegisteredCommands = () => registry;

export function Command(
  signature: string,
  description?: string,
  options?: Record<string, CommandOption | string>,
): ClassDecorator {
  return function (target) {
    registry.push({
      target,
      signature,
      description,
      options,
    });
  };
}
