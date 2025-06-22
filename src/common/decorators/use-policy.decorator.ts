import { SetMetadata, UseGuards } from '@nestjs/common'
import { Key } from '../enums/keys.enum'
import { Resource } from '../types/resource.type'
import { PolicyGuard } from '../guards/policy.guard'
import { Action } from '../types/action.type'

export function UsePolicy (action: Action, resource: Resource) {
  SetMetadata(Key.POLICY, [action, resource])
  return UseGuards(PolicyGuard)
}
