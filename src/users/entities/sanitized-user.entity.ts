import { UserWithRoles } from './user-with-roles.entity'
import { Roles } from 'src/common/types/roles.type'

export class SanitizedUser {
  id: number
  name: string
  surname: string
  birthDate: Date
  genre: string
  preferredCinemaId?: number
  createdAt: Date
  roles: Roles

  constructor(user: UserWithRoles) {
    this.id = user.id
    this.name = user.name
    this.surname = user.surname
    this.birthDate = user.birthDate
    this.genre = user.genre
    this.createdAt = user.createdAt
    this.roles = user.roles
    this.preferredCinemaId = user.preferredCinemaId ?? undefined
  }

  static getMany(users: UserWithRoles[]): SanitizedUser[] {
    return users.map((user) => new SanitizedUser(user))
  }
}
