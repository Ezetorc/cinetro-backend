import { Param, ParseIntPipe } from '@nestjs/common'

export function Id (ofUser?: 'ofUser') {
  const name = ofUser === 'ofUser' ? 'userId' : 'id'

  return Param(name, ParseIntPipe)
}
