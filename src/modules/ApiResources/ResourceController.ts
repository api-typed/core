import { validate } from 'class-validator';
import {
  BadRequestError,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  OnUndefined,
  Param,
  Patch,
  Post,
  QueryParam,
} from 'routing-controllers';
import { DeepPartial, EntityMetadata, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApiResponse } from '../../Http';
import { Paginator } from './Paginator';
import { ApiResourceMetaData } from './types';

function Conditional(active: boolean, decorator: Function): PropertyDecorator {
  return (target, propertyKey) => {
    if (active) {
      decorator(target, propertyKey);
    }
  };
}

export class ResourceController {
  public static create(metadata: ApiResourceMetaData): Function {
    const { path, resource, operations, perPage, sortDefault } = metadata;

    @JsonController(path)
    class LCRUDController<T = typeof resource> {
      private readonly metadata: EntityMetadata;

      constructor(
        @InjectRepository(resource) private readonly repository: Repository<T>,
      ) {
        this.metadata = this.repository.metadata;
      }

      @Conditional(operations.list.enabled, Get())
      public async list(@QueryParam('page') page = 1): Promise<ApiResponse<T>> {
        if (page < 1) {
          throw new BadRequestError('Page number must be positive.');
        }

        const paginator = new Paginator<T>(this.repository, {
          perPage,
          sortBy: this.getSortOrder() as any,
        });
        const { items, info: pagination } = await paginator.getPage(page);
        const { totalPages } = pagination;

        return new ApiResponse<T>(items, {
          pagination,
          links: {
            first: path,
            last: `${path}${totalPages > 1 ? `?page=${totalPages}` : ''}`,
            next: page < totalPages ? `${path}?page=${page + 1}` : null,
            prev: page > 1 ? `${path}?page=${page - 1}` : null,
            self: page === 1 ? path : `${path}?page=${page}`,
          },
        });
      }

      @Conditional(operations.create.enabled, Post())
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

      @Conditional(operations.read.enabled, Get('/:id'))
      public async read(
        @Param('id') id: number | string,
      ): Promise<ApiResponse<T>> {
        const entity = await this.getEntity(id);
        return new ApiResponse<T>(entity);
      }

      @Conditional(operations.update.enabled, Patch('/:id'))
      public async update(
        @Param('id') id: number | string,
        @Body() body: DeepPartial<T>,
      ): Promise<ApiResponse<T>> {
        const entity = await this.getEntity(id);
        const data = this.repository.create(body);

        const validationErrors = await validate(data as any, {
          forbidNonWhitelisted: true,
          skipUndefinedProperties: true,
          validationError: { target: false },
        });
        if (validationErrors.length > 0) {
          const error: any = new BadRequestError(
            `Invalid request, check 'errors' property for more info.`,
          );
          error.errors = validationErrors;
          throw error;
        }

        await this.repository.save(this.repository.merge(entity, body));

        const freshEntity = await this.getEntity(id);
        return new ApiResponse<T>(freshEntity);
      }

      @Conditional(operations.delete.enabled, Delete('/:id'))
      @OnUndefined(204)
      public async delete(
        @Param('id') id: number | string,
      ): Promise<undefined> {
        const entity = await this.getEntity(id);
        await this.repository.delete(entity);
        return undefined;
      }

      private async getEntity(id: number | string): Promise<T> {
        let entity: T | undefined;
        try {
          entity = await this.repository.findOne(id);
        } catch {
          // noop
        }

        if (!entity) {
          throw new NotFoundError();
        }

        return entity;
      }

      private getSortOrder(): Record<string, 'ASC' | 'DESC'> {
        if (sortDefault) {
          return sortDefault;
        }

        const order = {};

        if (this.metadata.createDateColumn) {
          order[this.metadata.createDateColumn.propertyName] = 'ASC';
        } else if (this.metadata.updateDateColumn) {
          order[this.metadata.updateDateColumn.propertyName] = 'ASC';
        } else {
          this.metadata.primaryColumns.forEach((column) => {
            order[column.propertyName] = 'ASC';
          });
        }

        return order;
      }
    }

    return LCRUDController;
  }
}
