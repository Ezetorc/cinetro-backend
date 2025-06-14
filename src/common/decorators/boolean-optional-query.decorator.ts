import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function BooleanOptionalQuery (name: string, description?: string) {
  return applyDecorators(
    ApiQuery({
      name,
      required: false,
      type: Boolean,
      description,
    }),
  )
}
