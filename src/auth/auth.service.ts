import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { ConfigService } from '@nestjs/config'
import { RoleName } from 'src/common/enums/role-name.enum'
import { UserRolesService } from 'src/user-roles/user-roles.service'
import { UserWithRoles } from 'src/users/entities/user-with-roles.entity'
import { JWTUser } from 'src/users/entities/jwt-user.entity'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRolesService: UserRolesService
  ) {}

  sign(user: UserWithRoles): string {
    return this.jwtService.sign(new JWTUser(user).toPlain(), {
      secret: this.configService.getOrThrow('jwt.secret')
    })
  }

  async hash(str: string): Promise<string> {
    return await bcrypt.hash(str, this.configService.getOrThrow('saltRounds'))
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.getByEmail(loginDto.email, 'withRoles')

    if (!user) return null

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password)

    if (!passwordMatches) return null

    const token = this.sign(user)

    return { token, user }
  }

  async register(data: RegisterUserDto) {
    const userAlreadyExists = await this.usersService.exists(data.email)

    if (userAlreadyExists) throw new ConflictException('Email already in use')

    const hashedPassword = await this.hash(data.password)
    const user = await this.usersService.create(
      {
        ...data,
        role: RoleName.USER,
        password: hashedPassword
      },
      'withRoles'
    )

    if (!user) throw new BadRequestException()

    for (const role of user.roles) {
      await this.userRolesService.create({
        cinemaId: role.cinemaId,
        roleName: role.name,
        userId: user.id
      })
    }

    const token = this.sign(user)

    return { user, token }
  }
}
