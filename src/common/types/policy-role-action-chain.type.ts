import { PolicyIf } from './policy-if.type'
import { PolicyRoleAction } from './policy-role-action.type'

export type PolicyRoleActionChain = {
  if: PolicyIf
  canAlsoCreate: PolicyRoleAction
  canAlsoDelete: PolicyRoleAction
  canAlsoUpdate: PolicyRoleAction
  canAlsoRead: PolicyRoleAction
  canAlsoManage: PolicyRoleAction
}
