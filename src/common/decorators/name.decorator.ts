import { Param } from '@nestjs/common'

export function Name() {
  return Param('name')
}
