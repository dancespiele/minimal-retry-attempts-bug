import {
  Controller,
  Get,
  Inject,
  Logger,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MATH_SERVICE } from './math.constants';
import { ExceptionFilter } from 'src/common/filters/rpc-exception.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller()
export class MathController {
  constructor(@Inject(MATH_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  execute(): Observable<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3, 4, 5];
    return this.client.send<number>(pattern, data);
  }

  @UseFilters(new ExceptionFilter())
  @UseInterceptors(new LoggingInterceptor())
  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): number {
    throw new RpcException({ code: '13', message: 'INTERNAL' });
  }
}
