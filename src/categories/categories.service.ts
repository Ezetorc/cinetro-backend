import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { Category } from '@prisma/client'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'

@Injectable()
export class CategoriesService {
  constructor (private readonly database: PrismaService) {}

  async create (createCategoryDto: CreateCategoryDto) {
    return this.database.category.create({ data: createCategoryDto })
  }

  async getAll () {
    return await this.database.category.findMany()
  }

  async getById (id: number) {
    return await this.database.category.findUnique({ where: { id } })
  }

  async getNamesByIds (categoriesIds: number[]) {
    const categories = await Promise.all(
      categoriesIds.map(categoryId =>
        this.database.category.findUnique({ where: { id: categoryId } }),
      ),
    )

    const categoryNames = categories
      .filter((c): c is Category => Boolean(c))
      .map(category => category?.name)

    return categoryNames
  }

  async update (id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.database.category.update({
        where: { id },
        data: updateCategoryDto,
      })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.database.category.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
