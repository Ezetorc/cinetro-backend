import { RoleName } from '../enums/role-name.enum'
import { Action } from '../types/action.type'
import { PolicyRoleActionChain } from '../types/policy-role-action-chain.type'
import { PolicyRoleAction } from '../types/policy-role-action.type'
import { PolicyRule } from '../types/policy-rule.type'
import { Resource } from '../types/resource.type'
import { capitalize } from '../utilities/capitalize.utility'
import { Policy } from './policy.helper'

export class PolicyRole {
  static actions: Action[] = ['create', 'delete', 'manage', 'read', 'update']
  canCreate: PolicyRoleAction
  canDelete: PolicyRoleAction
  canManage: PolicyRoleAction
  canUpdate: PolicyRoleAction
  canRead: PolicyRoleAction

  constructor (private policy: Policy, private readonly roleName: RoleName) {
    for (const action of PolicyRole.actions) {
      const methodName = `can${capitalize(action)}`
      this[methodName] = this._buildActionMethod(action)
    }
  }

  private _buildActionMethod (action: Action) {
    return (resource: Resource) => {
      const rule = {
        roleName: this.roleName,
        action,
        resource
      } as PolicyRule

      this.policy.rules.push(rule)

      const chain = {} as PolicyRoleActionChain

      for (const act of PolicyRole.actions) {
        const alsoMethod = `canAlso${capitalize(act)}`
        chain[alsoMethod] = this[`can${capitalize(act)}`].bind(this)
      }

      chain.if = (condition: PolicyRule['condition']) => {
        rule.condition = condition
        return chain
      }

      return chain
    }
  }
}
