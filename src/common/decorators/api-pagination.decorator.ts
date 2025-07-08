import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'cursor',
      required: false,
      type: String,
      description: 'Cursor for pagination (usually last item ID)'
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items to return (default: 8)'
    })
  )
}
