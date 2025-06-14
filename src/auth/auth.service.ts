import { ConflictException, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor (
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  sign (user: User): string {
    return this.jwtService.sign(
      {
        id: user.id,
        role: user.role
      },
      { secret: this.configService.getOrThrow('jwt.secret') }
    )
  }

  async hash (str: string): Promise<string> {
    return await bcrypt.hash(str, this.configService.getOrThrow('saltRounds'))
  }

  async login (loginDto: LoginUserDto) {
    const user = await this.usersService.getByEmail(loginDto.email)

    if (!user) return null

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password
    )

    if (!passwordMatches) return null

    const token = this.sign(user)

    return { token, user }
  }

  async register (registerUserDto: RegisterUserDto) {
    const userAlreadyExists = await this.usersService.exists(
      registerUserDto.email
    )

    if (userAlreadyExists) throw new ConflictException('Email already in use')

    const hashedPassword = await this.hash(registerUserDto.password)

    const user = await this.usersService.create({
      ...registerUserDto,
      role: 'USER',
      password: hashedPassword
    })

    const token = this.sign(user)

    return { user, token }
  }
}
