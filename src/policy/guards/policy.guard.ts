import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Key } from '../../common/enums/key.enum'
import { PolicyService } from 'src/policy/policy.service'
import { Resource } from 'src/policy/types/resource.type'
import { Action } from 'src/policy/types/action.type'
import { Request } from 'express'
import { policy } from 'src/configuration/policy.configuration'
import { JWTUser } from 'src/users/entities/jwt-user.entity'

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyService: PolicyService
  ) {}

  async canActivate(context: ExecutionContext) {
    const handler = context.getHandler()
    const request = context.switchToHttp().getRequest<Request>()
    const [action, resource] = this.reflector.get<[Action, Resource]>(Key.POLICY, handler)

    if (request.user) {
      return this.handleAuthenticatedAccess(request.user, action, resource, request)
    } else {
      return this.handleUnauthenticatedAccess(action, resource)
    }
  }

  private async handleAuthenticatedAccess(
    user: JWTUser,
    action: Action,
    resource: Resource,
    request: Request
  ) {
    const rule = user.getRule(action, resource)

    if (!rule) return false

    if (!rule.condition) return true

    const resourceData = await this.policyService.getResource(resource, request)

    if (!resourceData) throw new NotFoundException()

    return this.isConditionMet(rule.condition, user, resourceData)
  }

  private handleUnauthenticatedAccess(action: Action, resource: Resource) {
    const rule = policy.getRule({ roleName: 'anyone', action, resource })

    return Boolean(rule)
  }

  private isConditionMet(
    condition: (user: any, resource: any) => boolean,
    user: any,
    resource: object | object[]
  ): boolean {
    if (Array.isArray(resource)) {
      return resource.every((item) => condition(user, item))
    }

    return condition(user, resource)
  }
}
