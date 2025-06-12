import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept (_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'nextCursor' in data
        ) {
          return {
            value: data.data,
            nextCursor: data.nextCursor,
          }
        }

        return {
          value: data,
        }
      }),
    )
  }
}
