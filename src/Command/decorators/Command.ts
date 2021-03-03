import Container from 'typedi';
import { AppServices } from '../../App';
import { CommandApp } from '../CommandApp';
import { CommandOption } from '../CommandOption';

export function Command(
  signature: string,
  description?: string,
  options?: Record<string, CommandOption | string>,
): ClassDecorator {
  return function (target) {
    const app = Container.get<CommandApp>(AppServices.App);
    app.registerCommand(target, signature, description, options);
  };
}
