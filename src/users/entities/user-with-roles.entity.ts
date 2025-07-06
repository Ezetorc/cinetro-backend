import { Genre, User } from '@prisma/client'
import { Roles } from 'src/common/types/roles.type'

export class UserWithRoles implements User {
  id: number
  name: string
  surname: string
  birthDate: Date
  genre: Genre
  password: string
  email: string
  phoneNumber: string
  preferredCinemaId: number | null
  createdAt: Date
  roles: Roles

  constructor(user: User, roles: Roles) {
    Object.assign(this, {
      ...user,
      roles
    })
  }

  static getMany(users: User[], allRoles: Roles[]) {
    return users.map((user, index) => new UserWithRoles(user, allRoles[index]))
  }
}
