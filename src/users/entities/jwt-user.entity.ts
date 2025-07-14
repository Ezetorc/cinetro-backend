import { Roles } from 'src/common/types/roles.type'
import { UserWithRoles } from './user-with-roles.entity'
import { RoleName } from 'src/common/enums/role-name.enum'
import { policy } from 'src/configuration/policy.configuration'
import { Action } from 'src/policy/types/action.type'
import { Resource } from 'src/policy/types/resource.type'
import { isEmployee } from 'src/common/utilities/is-employee.utility'
import { Policy } from 'src/policy/entities/policy.entity'

export class JWTUser {
  constructor(user: UserWithRoles) {
    this.id = user.id
    this.roles = user.roles
  }

  id: number
  roles: Roles

  get isAdmin() {
    return this.hasRole(policy.adminRole as RoleName)
  }

  toPlain() {
    return {
      id: this.id,
      roles: this.roles
    }
  }

  hasRole(roleName: RoleName) {
    return this.roles.some((role) => role.name === roleName)
  }

  worksInCinema(cinemaId: number) {
    return this.roles.some((role) => role.cinemaId === cinemaId && isEmployee(role.name))
  }

  getRule(action: Action, resource: Resource) {
    const roleNames = new Set(this.roles.map((role) => role.name))

    return policy.rules.find((rule) => {
      const { roleName, action: ruleAction, resource: ruleResource } = Policy.splitRule(rule)

      return (
        roleNames.has(roleName as RoleName) && ruleAction === action && ruleResource === resource
      )
    })
  }
}
