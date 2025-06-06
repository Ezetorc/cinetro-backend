import { ConflictException, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { SALT_ROUNDS } from 'src/settings'

@Injectable()
export class AuthService {
  constructor (
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser (email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email)

    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)

    return isValid ? user : null
  }

  async login (user: User | undefined) {
    if (!user) return undefined

    const payload = { username: user.name, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register (createUserDto: CreateUserDto) {
    const existing = await this.usersService.getUserByEmail(createUserDto.email)

    if (existing) throw new ConflictException('Email already in use')

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(SALT_ROUNDS),
    )
    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    })

    const payload = { sub: user.id, email: user.email }
    const token = await this.jwtService.signAsync(payload)

    return { user, token }
  }
}
