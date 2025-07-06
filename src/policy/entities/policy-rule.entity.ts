import { JWTUser } from 'src/users/entities/jwt-user.entity'
import { Action } from '../types/action.type'
import { Resource } from '../types/resource.type'

export class PolicyRule {
  condition?: (user: JWTUser, resource: object) => boolean
  key: `${string}/${Action}/${Resource}`

  constructor(props: {
    roleName: string
    action: Action
    resource: Resource
    condition?: (user: JWTUser, resource: object) => boolean
  }) {
    this.key = `${props.roleName}/${props.action}/${props.resource}`
    this.condition = props.condition
  }

  static splitKey(key: PolicyRule['key']) {
    const [roleName, action, resource] = key.split('/') as [string, Action, Resource]

    return { roleName, action, resource }
  }
}
