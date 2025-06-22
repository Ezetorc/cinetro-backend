import { RoleName } from '../enums/role-name.enum'
import { PolicyRule } from '../types/policy-rule.type'
import { PolicyRole } from './policy-role.helper'

export class Policy {
  rules: PolicyRule[] = []
  user = new PolicyRole(this, RoleName.USER)
  admin = new PolicyRole(this, RoleName.ADMIN)
  manager = new PolicyRole(this, RoleName.MANAGER)
  cashier = new PolicyRole(this, RoleName.CASHIER)
}
