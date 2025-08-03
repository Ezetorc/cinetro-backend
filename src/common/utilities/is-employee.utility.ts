import { RoleName } from '../enums/role-name.enum'

export function isEmployee(roleName: RoleName): boolean {
  const employees: RoleName[] = [
    RoleName.ADMIN,
    RoleName.OPERATOR,
    RoleName.MANAGER,
    RoleName.CASHIER
  ]

  return employees.includes(roleName)
}
