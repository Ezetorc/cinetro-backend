import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Key } from '../../common/enums/keys.enum'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(Key.IS_PUBLIC, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context) as Promise<boolean>
  }
}
