import { Controller, Get } from 'routing-controllers';

@Controller('/')
export class HomeController {
  @Get()
  public home(): string {
    return '👍';
  }
}
