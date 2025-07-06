import { Action, pureActions } from '../types/action.type'
import { pureResources, Resource } from '../types/resource.type'
import { isPure } from '../utilities/is-pure.utility'
import { PolicyRoleChainWithIf } from './policy-role-chain-with-if.entity'
import { PolicyRoleChain } from './policy-role-chain.entity'
import { PolicyRule } from './policy-rule.entity'
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
    if (rule.key.includes(this.name)) {
      this._rules.push(rule)
    }
  }

  getRule(action: Action, resource: Resource) {
    return this._rules.find((rule) => {
      const { action: keyAction, resource: keyResource } = PolicyRule.splitKey(rule.key)

      return keyAction === action && keyResource === resource
    })
  }

  can(action: Action, resource: Exclude<Resource, 'all'>): PolicyRoleChainWithIf
  can(action: Action, resource: 'all'): PolicyRoleChain
  can(action: Action, resource: Resource) {
    this._addRules(action, resource)

    if (resource === 'all') {
      return this._getChain(action, 'all')
    } else {
      return this._getChain(action, resource)
    }
  }

  extends(policyRole: PolicyRole): Omit<PolicyRoleChain, 'if'> {
    policyRole.rules.forEach((rule) => this._rules.push(rule))

    return this._getChain()
  }

  private _getChain(action: Action, resource: Exclude<Resource, 'all'>): PolicyRoleChainWithIf
  private _getChain(action?: Action, resource?: 'all'): PolicyRoleChain
  private _getChain(action?: Action, resource?: Resource) {
    const bothDefined = action !== undefined && resource !== undefined
    const withIf = bothDefined && isPure(resource)

    if (withIf) {
      return new PolicyRoleChainWithIf(this, action, resource)
    } else {
      return new PolicyRoleChain(this)
    }
  }

  private _addRules(action: Action, resource: Resource) {
    const actions = action === 'manage' ? pureActions : [action]
    const resources = resource === 'all' ? pureResources : [resource]

    for (const newAction of actions) {
      for (const newResource of resources) {
        const newRule = new PolicyRule({
          roleName: this.name,
          action: newAction,
          resource: newResource
        })

        this._policy.addRule(newRule)
      }
    }
  }
}
