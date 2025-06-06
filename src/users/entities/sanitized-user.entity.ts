import { User } from '@prisma/client'

export class SanitizedUser {
  id: number
  name: string
  surname: string
  birthDate: Date
  genre: string
  preferredCinemaId?: number
  createdAt: Date

  constructor (user: User) {
    this.id = user.id
    this.name = user.name
    this.surname = user.surname
    this.birthDate = user.birthDate
    this.genre = user.genre
    this.preferredCinemaId = user.preferredCinemaId ?? undefined
    this.createdAt = user.createdAt
  }
}
