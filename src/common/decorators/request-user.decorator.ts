import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export const RequestUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()

  if (request && typeof request === 'object') {
    return request.user
  }

  return null
})
