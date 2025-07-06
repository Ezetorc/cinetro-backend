import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, map } from 'rxjs'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const isObject = response && typeof response === 'object'
        const hasData = 'data' in response
        const hasNextCursor = 'nextCursor' in response

        if (isObject && hasData && hasNextCursor) {
          return {
            value: response.data,
            nextCursor: response.nextCursor
          }
        } else {
          return {
            value: response
          }
        }
      })
    )
  }
}
