import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prismaService.category.create({ data })
  }

  async getAll() {
    return await this.prismaService.category.findMany()
  }

  async getById(name: string) {
    return await this.prismaService.category.findUnique({ where: { name } })
  }

  async update(name: string, data: UpdateCategoryDto) {
    return await catchTo(this.prismaService.category.update({ where: { name }, data }))
  }

  async delete(name: string) {
    return await catchTo(this.prismaService.category.delete({ where: { name } }))
  }
}
