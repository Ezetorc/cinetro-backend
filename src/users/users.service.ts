import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../common/services/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UsersService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async create (data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      data.password,
      this.configService.getOrThrow('saltRounds')
    )

    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
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
