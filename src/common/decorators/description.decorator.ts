import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function Description (description: string, status?: HttpStatus) {
  return applyDecorators(ApiResponse({ description, status }))
}
