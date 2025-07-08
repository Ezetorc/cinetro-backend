import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { tryTo } from 'src/common/utilities/try-to.utility'
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

  async validate(payload: { id: number }) {
    const [user, error] = await tryTo(this.usersService.getById(payload.id, 'withRoles'))

    if (error || !user) {
      return null
    } else {
      return new JWTUser(user)
    }
  }
}
