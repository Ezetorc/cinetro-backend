import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'
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
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRolesService: UserRolesService
  ) {}

  getAuthorization(user: UserWithRoles) {
    const payload = new JWTUser(user).toPlain()
    const secret = this.configService.getOrThrow('jwt.secret')

    return this.jwtService.sign(payload, { secret })
  }

  async hash(str: string) {
    return await hash(str, this.configService.getOrThrow('jwt.saltRounds'))
  }

  async login(data: LoginUserDto) {
    const user = await this.usersService.getByEmail(data.email, 'withRoles')

    if (!user) throw new NotFoundException("User doesn't exist")

    const passwordMatches = await compare(data.password, user.password)

    if (!passwordMatches) throw new BadRequestException('Invalid credentials')

    const authorization = this.getAuthorization(user)

    return { authorization, user }
  }

  async register(data: RegisterUserDto) {
    const userExists = await this.usersService.exists(data.email)

    if (userExists) throw new ConflictException('Email already in use')

    const hashedPassword = await this.hash(data.password)
    const user = await this.usersService.create(
      { ...data, role: RoleName.USER, password: hashedPassword },
      'withRoles'
    )

    if (!user) throw new BadRequestException()

    await this.userRolesService.createUserRolesOf(user)
    const authorization = this.getAuthorization(user)

    return { user, authorization }
  }
}
