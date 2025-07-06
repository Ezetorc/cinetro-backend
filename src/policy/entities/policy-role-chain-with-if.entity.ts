import { Action, pureActions } from '../types/action.type'
import { Resource } from '../types/resource.type'
import { PolicyRoleChain } from './policy-role-chain.entity'
import { PolicyRole } from './policy-role.entity'
import { PolicyRule } from './policy-rule.entity'
import { JWTUser } from 'src/users/entities/jwt-user.entity'

export class PolicyRoleChainWithIf extends PolicyRoleChain {
  constructor(policyRole: PolicyRole, action: Action, resource: Resource) {
    super(policyRole)
    this._setIf(action, resource)
  }

  if: <Model extends object>(
    condition: (user: JWTUser, resource: Model) => boolean
  ) => PolicyRoleChain

  private _setIf(action: Action, resource: Resource) {
    if (action === 'manage') {
      this.if = (condition: PolicyRule['condition']) => {
        for (const action of pureActions) {
          const finalRule = this._getFinalRule(action, resource)

          if (!finalRule) return this

          finalRule.condition = condition
        }

        return this
      }
    } else {
      const rule = this._policyRole.getRule(action, resource)

      if (!rule) return

      this.if = (condition: PolicyRule['condition']) => {
        rule.condition = condition
        return this
      }
    }
  }

  private _getFinalRule(action: Action, resource: Resource) {
    return this._policyRole.rules.find((finalRule) => {
      const { action: finalRuleAction, resource: finalRuleResource } = PolicyRule.splitKey(
        finalRule.key
      )

      return finalRuleAction === action && finalRuleResource === resource
    })
  }
}
