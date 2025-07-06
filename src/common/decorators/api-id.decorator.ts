import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'

export function ApiId(description?: string) {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      type: Number,
      description
    })
  )
}
