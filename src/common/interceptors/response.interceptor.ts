import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Response } from 'express'
import { Observable, map } from 'rxjs'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const isObject = response && typeof response === 'object'
        const hasData = isObject && 'data' in response
        const hasNextCursor = isObject && 'nextCursor' in response

        if (hasData) {
          return {
            value: response.data,
            ...(hasNextCursor ? { nextCursor: response.nextCursor } : {})
          }
        }

        return response as Response
      })
    )
  }
}
