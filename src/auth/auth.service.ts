import { ConflictException, Injectable } from '@nestjs/common'
import { UsersService } from 'src/resources/users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto'
import { DEFAULT_USER_ROLE, JWT_SECRET, SALT_ROUNDS } from 'src/settings'
import { RegisterUserDto } from './dto/register-user.dto'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor (
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  sign (user: User): string {
    return this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
      },
      { secret: JWT_SECRET },
    )
  }

  async hash (str: string): Promise<string> {
    return await bcrypt.hash(str, SALT_ROUNDS)
  }

  async login (loginDto: LoginUserDto) {
    const user = await this.usersService.getByEmail(loginDto.email)

    if (!user) return null

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    )

    if (!passwordMatches) return null

    const token = this.sign(user)

    return { token, user }
  }

  async register (registerUserDto: RegisterUserDto) {
    const userAlreadyExists = await this.usersService.exists(
      registerUserDto.email,
    )

    if (userAlreadyExists) throw new ConflictException('Email already in use')

    const hashedPassword = await this.hash(registerUserDto.password)

    const user = await this.usersService.create({
      ...registerUserDto,
      role: DEFAULT_USER_ROLE,
      password: hashedPassword,
    })

    const token = this.sign(user)

    return { user, token }
  }
}
