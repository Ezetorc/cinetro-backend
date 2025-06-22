import { RoleName } from 'src/common/enums/role-name.enum'
import { UserWithRoles } from './user-with-roles.entity'

export class SanitizedUser {
  id: number
  name: string
  surname: string
  birthDate: Date
  genre: string
  preferredCinemaId?: number
  createdAt: Date
  roles: RoleName[]

  constructor (user: UserWithRoles) {
    Object.assign(this, {
      ...user,
      preferredCinemaId: user.preferredCinemaId ?? undefined
    })
  }

  static getMany (users: UserWithRoles[]): SanitizedUser[] {
    return users.map(user => new SanitizedUser(user))
  }
}
