import { CacheKeys } from './../common/helpers/cache-keys.helper'
import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { catchTo } from 'src/common/utilities/catch-to.utility'
import { CacheService } from 'src/common/services/cache.service'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { Category } from '@prisma/client'

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateCategoryDto) {
    return await catchTo(this.prismaService.category.create({ data }))
  }

  async getAll(paginationDto: PaginationDto) {
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

  async getById(name: string) {
    return await this.prismaService.category.findUnique({ where: { name } })
  }

  async delete(name: string) {
    return await catchTo(this.prismaService.category.delete({ where: { name } }))
  }
}
