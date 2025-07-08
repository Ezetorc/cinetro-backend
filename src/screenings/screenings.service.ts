import { Injectable } from '@nestjs/common'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { PrismaService } from '../common/services/prisma.service'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { Screening } from '@prisma/client'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class ScreeningsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateScreeningDto) {
    return await catchTo(this.prismaService.screening.create({ data }))
  }

  async getAll(paginationArgs: PaginationArgs) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_SCREENINGS(paginationArgs),
      ttl: '1h',
      fn: () =>
        this.prismaService.paginate<Screening>({
          model: 'screening',
          paginationArgs
        })
    })
  }

  async getById(id: number) {
    return await this.cacheService.cached({
      key: CacheKeys.SCREENING(id),
      ttl: '1h',
      fn: () => this.prismaService.screening.findUnique({ where: { id } })
    })
  }

  async update(id: number, data: UpdateScreeningDto) {
    return await catchTo(this.prismaService.screening.update({ where: { id }, data }))
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.screening.delete({ where: { id } }))
  }
}
