import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Key } from '../../common/enums/keys.enum'
import { PolicyService } from 'src/policy/policy.service'
import { Resource } from 'src/policy/types/resource.type'
import { Action } from 'src/policy/types/action.type'
import { Request } from 'express'
import { policy } from 'src/configuration/policy.configuration'

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
    const user = request.user

    if (!user) {
      const rule = policy.getRule({ roleName: 'anyone', action, resource })

      return Boolean(rule)
    }

    const rule = user.getRule(action, resource)

    if (!rule) return false

    if (!rule.condition) return true

    const resourceModel = await this.policyService.getResource(resource, request)

    if (!resourceModel) throw new NotFoundException()

    if (Array.isArray(resourceModel)) {
      return resourceModel.every((resource) => rule.condition!(user, resource))
    }

    return rule.condition(user, resourceModel)
  }
}
