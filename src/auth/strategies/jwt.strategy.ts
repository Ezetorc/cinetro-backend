import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JWTUser } from 'src/users/entities/jwt-user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret')
    })
  }

  async validate(payload: any) {
    if (typeof payload !== 'object' || payload === null || !('id' in payload)) {
      return null
    }

    const { id } = payload as { id: unknown }

    const userId = typeof id === 'string' ? parseInt(id, 10) : typeof id === 'number' ? id : null

    if (userId === null || Number.isNaN(userId)) return null

    try {
      const user = await this.usersService.getById(userId, 'withRoles')

      if (!user) return null

      return new JWTUser(user)
    } catch {
      return null
    }
  }
}
