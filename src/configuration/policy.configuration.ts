import { RoleName } from 'src/common/enums/role-name.enum'
import { Policy } from 'src/policy/entities/policy.entity'

export const policy = new Policy()
const anyone = policy.anyone
const admin = policy.addRole(RoleName.ADMIN)
const operator = policy.addRole(RoleName.OPERATOR)
const manager = policy.addRole(RoleName.MANAGER)
const cashier = policy.addRole(RoleName.CASHIER)
const user = policy.addRole(RoleName.USER)

admin.can('manage', 'all')

operator.extends(manager).canAlso('create', 'user-role')

manager.extends(cashier)

cashier.extends(user).canAlso('manage', 'ticket:of-cinema')

user
  .extends(anyone)
  .canAlso('read', 'ticket:own')
  .canAlso('read', 'screening:all')
  .canAlso('read', 'user:own')

anyone
  .can('read', 'movie:all')
  .canAlso('read', 'movie')
  .canAlso('create', 'user:authorization')
  .canAlso('create', 'user:own')
