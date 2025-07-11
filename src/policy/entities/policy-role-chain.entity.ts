import { Action } from '../types/action.type'
import { Resource } from '../types/resource.type'
import { PolicyRole } from './policy-role.entity'

export class PolicyRoleChain {
  protected _policyRole: PolicyRole

  constructor(policyRole: PolicyRole) {
    this._policyRole = policyRole
  }

  canAlso(action: Action, resource: Resource) {
    return this._policyRole.can(action, resource)
  }
}
