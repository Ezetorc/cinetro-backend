import { RoleName } from '../enums/role-name.enum'

export function isEmployee(roleName: RoleName): boolean {
  return ['admin', 'operator', 'manager', 'cashier'].includes(roleName)
}
