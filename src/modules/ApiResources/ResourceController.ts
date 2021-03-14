import {
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from 'routing-controllers';
import { ApiResourceMetaData } from './types';

export class ResourceController {
  public static create(metadata: ApiResourceMetaData): Function {
    const { path, resource } = metadata;

    @JsonController(path)
    class LCRUDController<T = typeof resource> {
      @Get()
      public list(): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Post()
      public create(): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Get('/:id')
      public read(@Param('id') id: number | string): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Post('/:id')
      public update(@Param('id') id: number | string): T {
        throw new NotFoundError('Not implemented yet');
      }

      @Delete('/:id')
      public delete(@Param('id') id: number | string): T {
        throw new NotFoundError('Not implemented yet');
      }
    }

    return LCRUDController;
  }
}
