import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Key } from '../../common/enums/keys.enum'
import { PolicyGuard } from '../guards/policy.guard'
import { Action } from 'src/policy/types/action.type'
import { Resource } from 'src/policy/types/resource.type'

export function UsePolicy(action: Action, resource: Resource) {
  return applyDecorators(SetMetadata(Key.POLICY, [action, resource]), UseGuards(PolicyGuard))
}
