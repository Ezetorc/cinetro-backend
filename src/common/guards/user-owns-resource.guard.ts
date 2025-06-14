import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common'
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface'

@Injectable()
export class UserOwnsResourceGuard implements CanActivate {
  canActivate (context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const user = request.user
    const userIdParam = parseInt(request.params.userId, 10)

    if (isNaN(userIdParam)) {
      throw new ForbiddenException('Invalid user ID')
    }

    if (user.id !== userIdParam) {
      throw new ForbiddenException('Forbidden resource')
    }

    return true
  }
}
