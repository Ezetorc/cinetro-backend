import { RoleName } from '../enums/role-name.enum'

export type Roles = {
  name: RoleName
  cinemaId: number | null
}[]
