import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'

export function ApiName(description?: string) {
  return applyDecorators(
    ApiParam({
      name: 'name',
      required: true,
      type: String,
      description
    })
  )
}
