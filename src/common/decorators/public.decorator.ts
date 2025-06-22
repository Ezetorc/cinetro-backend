import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'
import { Key } from '../enums/keys.enum'

export function Public () {
  return applyDecorators(SetMetadata(Key.IS_PUBLIC, true), ApiSecurity({}))
}
