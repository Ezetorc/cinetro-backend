import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { Category } from '@prisma/client'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prismaService.category.create({ data })
  }

  async getAll() {
    return await this.prismaService.category.findMany()
  }

  async getById(id: number) {
    return await this.prismaService.category.findUnique({ where: { id } })
  }

  async getNamesByIds(categoriesIds: number[]) {
    const categories = await Promise.all(
      categoriesIds.map((categoryId) =>
        this.prismaService.category.findUnique({ where: { id: categoryId } })
      )
    )

    const categoryNames = categories
      .filter((category): category is Category => Boolean(category))
      .map((category) => category?.name)

    return categoryNames
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.category.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
