import { Request } from 'express'
import { JWTUser } from 'src/users/entities/jwt-user.entity'

export type AuthenticatedRequest = Request & {
  user: JWTUser
}
