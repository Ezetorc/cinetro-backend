import { Action, pureActions } from '../types/action.type'
import { PolicyRule } from '../types/policy-rule.type'
import { pureResources, Resource } from '../types/resource.type'
import { PolicyRoleChain } from './policy-role-chain.entity'
import { Policy } from './policy.entity'

export class PolicyRole {
  constructor(policy: Policy, name: string) {
    this._policy = policy
    this.name = name
  }

  private _rules: PolicyRule[] = []
  private _policy: Policy
  name: string

  get rules() {
    return [...this._rules] as ReadonlyArray<PolicyRule>
  }

  addRule(rule: PolicyRule) {
    if (rule.includes(this.name)) {
      this._rules.push(rule)
    }
  }

  getRule(action: Action, resource: Resource) {
    return this._rules.find((rule) => {
      const { action: keyAction, resource: keyResource } = Policy.splitRule(rule)

      return keyAction === action && keyResource === resource
    })
  }

  can(action: Action, resource: Resource) {
    this._addRules(action, resource)

    return this._chain
  }

  extends(...policyRoles: PolicyRole[]) {
    policyRoles.forEach((policyRole) => policyRole.rules.forEach((rule) => this._rules.push(rule)))

    return this
  }

  private get _chain() {
    return new PolicyRoleChain(this)
  }

  private _addRules(action: Action, resource: Resource) {
    const actions = action === 'manage' ? pureActions : [action]
    const resources = resource === 'all' ? pureResources : [resource]

    for (const newAction of actions) {
      for (const newResource of resources) {
        const newRule = Policy.createRule(this.name, newAction, newResource)

        this._policy.addRule(newRule)
      }
    }
  }
}
