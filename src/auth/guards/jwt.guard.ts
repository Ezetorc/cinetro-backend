import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_error: any, user: any) {
    if (typeof user !== 'object' || user === null || !('id' in user)) return null as TUser

    const { id } = user as { id: unknown }
    const userId =
      typeof id === 'string' ? parseInt(id, 10) : typeof id === 'number' ? id : (null as TUser)

    if (userId === null || Number.isNaN(userId)) {
      return null as TUser
    } else {
      return user as TUser
    }
  }
}
