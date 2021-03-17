import { validate } from 'class-validator';
import {
  BadRequestError,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpError,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApiResponse } from '../../Http';
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
      constructor(
        @InjectRepository(resource) private readonly repository: Repository<T>,
      ) {}

      @Conditional(operations[Operation.List].enabled, Get())
      public list(): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Conditional(operations[Operation.Create].enabled, Post())
      @HttpCode(201)
      public async create(
        @Body() body: DeepPartial<T>,
      ): Promise<ApiResponse<T>> {
        const entity = this.repository.create(body);

        const validationErrors = await validate(entity as any, {
          validationError: { target: false },
        });
        if (validationErrors.length > 0) {
          const error: any = new BadRequestError(
            `Invalid request, check 'errors' property for more info.`,
          );
          error.errors = validationErrors;
          throw error;
        }

        await this.repository.save(entity);
        return new ApiResponse<T>(entity);
      }

      @Conditional(operations[Operation.Read].enabled, Get('/:id'))
      public async read(
        @Param('id') id: number | string,
      ): Promise<ApiResponse<T>> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
          throw new NotFoundError();
        }
        return new ApiResponse<T>(entity);
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
