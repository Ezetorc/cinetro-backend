import { Request as ExpressRequest } from 'express'
import { JWTUser } from 'src/users/entities/jwt-user.entity'

declare module 'express' {
  interface Request extends ExpressRequest {
    user: JWTUser | null
  }
}
