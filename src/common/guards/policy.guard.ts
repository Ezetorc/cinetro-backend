import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthenticatedRequest } from '../types/authenticated-request.type'
import { Key } from '../enums/keys.enum'
import { Resource } from '../types/resource.type'
import { Action } from '../types/action.type'

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor (private readonly reflector: Reflector) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const [action, resource] =
      this.reflector.get<[Action, Resource]>(Key.POLICY, handler) || []
    const request = context.switchToHttp().getRequest() as AuthenticatedRequest
    const user = request.user

    return user.can(action, resource)
  }
}
