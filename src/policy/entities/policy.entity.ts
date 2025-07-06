import { Action } from '../types/action.type'
import { Resource } from '../types/resource.type'
import { PolicyRole } from './policy-role.entity'
import { PolicyRule } from './policy-rule.entity'

export class Policy {
  private _roles: PolicyRole[] = [new PolicyRole(this, 'anyone')]

  get anyone() {
    return this._roles[0]
  }

  get rules() {
    return this._roles.flatMap((role) => role.rules) as ReadonlyArray<PolicyRule>
  }

  addRole(roleName: string) {
    const newRole = new PolicyRole(this, roleName)

    this._roles.push(newRole)

    return newRole
  }

  addRule(rule: PolicyRule) {
    const { roleName } = PolicyRule.splitKey(rule.key)
    const policyRole = this._roles.find((role) => role.name === roleName)

    if (policyRole) {
      policyRole.addRule(rule)
    }
  }

  getRule(args: { roleName: string; action: Action; resource: Resource }) {
    const policyRole = this._roles.find((role) => role.name === args.roleName)

    if (!policyRole) return undefined

    return policyRole.rules.find((rule) => {
      const { action, resource } = PolicyRule.splitKey(rule.key)
      const actionMatches = action === args.action
      const resourceMatches = resource === args.resource

      return actionMatches && resourceMatches
    })
  }
}
