import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import * as bcrypt from 'bcrypt'
import { SALT_ROUNDS } from 'src/settings'

@Injectable()
export class UsersService {
  constructor (private readonly database: PrismaService) {}

  async createUser (createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(SALT_ROUNDS),
    )

    return this.database.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    })
  }

  async getAllUsers () {
    return await this.database.user.findMany()
  }

  async getUserById (id: number) {
    return await this.database.user.findUnique({ where: { id } })
  }

  async getUserByEmail (email: string) {
    return await this.database.user.findUnique({ where: { email } })
  }

  async updateUser (id: number, updateUserDto: UpdateUserDto) {
    return await this.database.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  async deleteUser (id: number) {
    return await this.database.user.delete({ where: { id } })
  }
}
