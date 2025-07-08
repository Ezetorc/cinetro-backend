import { SetMetadata } from '@nestjs/common'
import { Key } from '../../common/enums/key.enum'
import { Action } from 'src/policy/types/action.type'
import { Resource } from 'src/policy/types/resource.type'

export function UsePolicy(action: Action, resource: Resource) {
  return SetMetadata(Key.POLICY, [action, resource])
}
