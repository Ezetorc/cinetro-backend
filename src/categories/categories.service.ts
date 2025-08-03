import { CacheKeys } from './../common/helpers/cache-keys.helper'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { CacheService } from 'src/common/services/cache.service'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { Category } from '@prisma/client'
import { PaginateResponse } from 'src/common/types/paginate-response.type'

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService
  ) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prismaService.category.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginateResponse<Category>> {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_CATEGORIES(paginationDto),
      ttl: '1d',
      fn: () =>
        this.prismaService.paginate<Category>({
          model: 'category',
          dto: paginationDto
        })
    })
  }

  async getById(name: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({ where: { name } })

    if (category) {
      return category
    } else {
      throw new NotFoundException(`Category "${name}" not found`)
    }
  }

  async delete(name: string): Promise<Category> {
    try {
      return await this.prismaService.category.delete({ where: { name } })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
