import { Param, ParseIntPipe } from '@nestjs/common'

export function Id() {
  return Param('id', ParseIntPipe)
}
