import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return await catchTo(this.prismaService.category.create({ data }))
  }

  async getAll() {
    return await this.prismaService.category.findMany()
  }

  async getById(name: string) {
    return await this.prismaService.category.findUnique({ where: { name } })
  }

  async delete(name: string) {
    return await catchTo(this.prismaService.category.delete({ where: { name } }))
  }
}
