import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Key } from '../../common/enums/key.enum'
import { Resource } from 'src/policy/types/resource.type'
import { Action } from 'src/policy/types/action.type'
import { Request } from 'express'
import { policy } from 'src/configuration/policy.configuration'
import { JWTUser } from 'src/users/entities/jwt-user.entity'

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const handler = context.getHandler()
    const request = context.switchToHttp().getRequest<Request>()
    const [action, resource] = this.reflector.get<[Action, Resource]>(Key.POLICY, handler)

    if (request.user) {
      if (request.user.isAdmin) {
        return true
      } else {
        return this.hasAuthenticatedAccess(action, resource, request.user)
      }
    } else {
      return this.hasUnauthenticatedAccess(action, resource)
    }
  }

  hasAuthenticatedAccess(action: Action, resource: Resource, user: JWTUser) {
    const unauthenticatedHasAccess = this.hasUnauthenticatedAccess(action, resource)

    if (unauthenticatedHasAccess) {
      return true
    } else {
      const rule = user.getRule(action, resource)

      return Boolean(rule)
    }
  }

  hasUnauthenticatedAccess(action: Action, resource: Resource) {
    const rule = policy.getRule({ roleName: 'anyone', action, resource })

    return Boolean(rule)
  }
}
