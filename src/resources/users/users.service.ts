import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { SALT_ROUNDS } from 'src/settings'
import { PrismaService } from '../common/services/prisma.service'

@Injectable()
export class UsersService {
  constructor (private readonly prismaService: PrismaService) {}

  async create (data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
  }

  async getAll () {
    return await this.prismaService.user.findMany()
  }

  async getById (id: number) {
    return await this.prismaService.user.findUnique({ where: { id } })
  }

  async getByEmail (email: string) {
    return await this.prismaService.user.findUnique({ where: { email } })
  }

  async exists (email: string) {
    const count = await this.prismaService.user.count({ where: { email } })

    return Boolean(count)
  }

  async update (id: number, data: UpdateUserDto) {
    return await this.prismaService.user.update({ where: { id }, data })
  }

  async delete (id: number) {
    return await this.prismaService.user.delete({ where: { id } })
  }
}
