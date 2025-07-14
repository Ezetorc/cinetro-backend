import { Action } from '../types/action.type'
import { PolicyRule } from '../types/policy-rule.type'
import { Resource } from '../types/resource.type'
import { PolicyRole } from './policy-role.entity'

export class Policy {
  constructor(props: { adminRole: string }) {
    this.adminRole = props.adminRole
  }

  private _roles: PolicyRole[] = [new PolicyRole(this, 'anyone')]
  public adminRole: string

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
    const { roleName } = Policy.splitRule(rule)
    const policyRole = this._roles.find((role) => role.name === roleName)

    if (policyRole) {
      policyRole.addRule(rule)
    }
  }

  getRule(args: { roleName: string; action: Action; resource: Resource }) {
    const policyRole = this._roles.find((role) => role.name === args.roleName)

    if (!policyRole) return undefined

    return policyRole.rules.find((rule) => {
      const { action, resource } = Policy.splitRule(rule)
      const actionMatches = action === args.action
      const resourceMatches = resource === args.resource

      return actionMatches && resourceMatches
    })
  }

  static splitRule(key: PolicyRule) {
    const [roleName, action, resource] = key.split('/') as [string, Action, Resource]

    return { roleName, action, resource }
  }

  static createRule(roleName: string, action: Action, resource: Resource): PolicyRule {
    return `${roleName}/${action}/${resource}`
  }
}
