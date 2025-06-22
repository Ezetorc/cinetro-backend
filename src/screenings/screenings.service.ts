import { Injectable } from '@nestjs/common'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { PrismaService } from '../common/services/prisma.service'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { Screening } from '@prisma/client'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'

@Injectable()
export class ScreeningsService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async create (data: CreateScreeningDto) {
    try {
      return await this.prismaService.screening.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getAll (paginationArgs: PaginationArgs) {
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

  async getById (id: number) {
    return await this.cacheService.cached({
      key: CacheKeys.SCREENING(id),
      ttl: '1h',
      fn: () => this.prismaService.screening.findUnique({ where: { id } })
    })
  }

  async update (id: number, data: UpdateScreeningDto) {
    try {
      return await this.prismaService.screening.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.prismaService.screening.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
