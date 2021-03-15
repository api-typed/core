import {
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { ApiResourceMetaData, Operation } from './types';

function Conditional(active: boolean, decorator: Function): PropertyDecorator {
  return (target, propertyKey) => {
    if (active) {
      decorator(target, propertyKey);
    }
  };
}

export class ResourceController {
  public static create(metadata: ApiResourceMetaData): Function {
    const { path, resource, operations } = metadata;

    @JsonController(path)
    class LCRUDController<T = typeof resource> {
      @Conditional(operations[Operation.List].enabled, Get())
      public list(): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Conditional(operations[Operation.Create].enabled, Post())
      public create(): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Conditional(operations[Operation.Read].enabled, Get('/:id'))
      public read(@Param('id') id: number | string): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Conditional(operations[Operation.Update].enabled, Patch('/:id'))
      public update(@Param('id') id: number | string): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Conditional(operations[Operation.Delete].enabled, Delete('/:id'))
      public delete(@Param('id') id: number | string): T {
        throw new NotFoundError('Not implemented yet');
      }
    }

    return LCRUDController;
  }
}
