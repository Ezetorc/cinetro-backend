import { Action } from '../types/action.type'
import { Resource } from '../types/resource.type'
import { PolicyRoleChainWithIf } from './policy-role-chain-with-if.entity'
import { PolicyRole } from './policy-role.entity'

export class PolicyRoleChain {
  protected _policyRole: PolicyRole

  constructor(policyRole: PolicyRole) {
    this._policyRole = policyRole
  }

  canAlso(action: Action, resource: Exclude<Resource, 'all'>): PolicyRoleChainWithIf
  canAlso(action: Action, resource: 'all'): PolicyRoleChain
  canAlso(action: Action, resource: Resource) {
    if (resource === 'all') {
      return this._policyRole.can(action, 'all')
    } else {
      return this._policyRole.can(action, resource)
    }
  }
}
