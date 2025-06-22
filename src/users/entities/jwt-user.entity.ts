import { Roles } from 'src/common/types/roles.type'
import { UserWithRoles } from './user-with-roles.entity'
import { RoleName } from 'src/common/enums/role-name.enum'
import { Resource } from 'src/common/types/resource.type'
import { policy } from 'src/configuration/policy.configuration'
import { Action } from 'src/common/types/action.type'

export class JWTUser {
  id: number
  roles: Roles

  constructor (user: UserWithRoles) {
    this.id = user.id
    this.roles = user.roles
  }

  hasRole (roleName: RoleName): boolean {
    return this.roles.some(role => role.name === roleName)
  }

  can (action: Action, resource: Resource): boolean {
    return policy.rules.some(
      rule => rule.action === action && rule.resource === resource
    )
  }
}
