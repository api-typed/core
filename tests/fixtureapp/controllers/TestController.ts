import {
  Body,
  Delete,
  Get,
  JsonController,
  Patch,
  Post,
  Put,
} from 'routing-controllers';

@JsonController('/test')
export class TestController {
  @Get()
  public get(): any {
    return {
      method: 'GET',
      body: null,
    };
  }

  @Post()
  public post(@Body() body: any): any {
    return {
      method: 'POST',
      body,
    };
  }

  @Patch()
  public patch(@Body() body: any): any {
    return {
      method: 'PATCH',
      body,
    };
  }

  @Put()
  public put(@Body() body: any): any {
    return {
      method: 'PUT',
      body,
    };
  }

  @Delete()
  public delete(@Body() body: any): any {
    return {
      method: 'DELETE',
      body,
    };
  }
}
