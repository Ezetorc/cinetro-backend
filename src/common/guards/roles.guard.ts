import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Role } from '@prisma/client'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { DEFAULT_REQUIRED_ROLES } from '../constants/default-required-roles.constant'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor (private reflector: Reflector) {}

  canActivate (context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    )

    if (isPublic) return true

    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? DEFAULT_REQUIRED_ROLES

    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user as { role: Role; id: number } | undefined

    if (!user) return false

    return requiredRoles.includes(user.role)
  }
}
