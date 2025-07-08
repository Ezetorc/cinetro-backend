import { CacheKeys } from './../common/helpers/cache-keys.helper'
import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { catchTo } from 'src/common/utilities/catch-to.utility'
import { CacheService } from 'src/common/services/cache.service'
import { PaginationArgs } from 'src/common/dto/pagination-args.dto'
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

  async getAll(paginationArgs: PaginationArgs) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_CATEGORIES(paginationArgs),
      ttl: '1d',
      fn: () =>
        this.prismaService.paginate<Category>({
          model: 'category',
          paginationArgs: paginationArgs
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
