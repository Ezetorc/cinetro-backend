import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Key } from '../../common/enums/key.enum'
import { Resource } from 'src/policy/types/resource.type'
import { Action } from 'src/policy/types/action.type'
import { Request } from 'express'
import { policy } from 'src/configuration/policy.configuration'
import { JWTUser } from 'src/users/entities/jwt-user.entity'
import { RoleName } from 'src/common/enums/role-name.enum'

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const handler = context.getHandler()
    const request = context.switchToHttp().getRequest<Request>()
    const [action, resource] = this.reflector.get<[Action, Resource]>(Key.POLICY, handler)

    if (request.user) {
      if (request.user.hasRole(RoleName.ADMIN)) {
        return true
      } else {
        return this.handleAuthenticatedAccess(request.user, action, resource)
      }
    } else {
      return this.handleUnauthenticatedAccess(action, resource)
    }
  }

  private handleAuthenticatedAccess(user: JWTUser, action: Action, resource: Resource) {
    const rule = user.getRule(action, resource)

    return Boolean(rule)
  }

  private handleUnauthenticatedAccess(action: Action, resource: Resource) {
    const rule = policy.getRule({ roleName: 'anyone', action, resource })

    return Boolean(rule)
  }
}
