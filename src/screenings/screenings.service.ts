import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { PrismaService } from '../common/services/prisma.service'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { Screening } from '@prisma/client'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'

@Injectable()
export class ScreeningsService {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService
  ) {}

  async create(data: CreateScreeningDto) {
    try {
      return await this.prismaService.screening.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async getAll(paginationDto: PaginationDto) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_SCREENINGS(paginationDto),
      ttl: '1h',
      fn: () => this.prismaService.paginate<Screening>({ model: 'screening', dto: paginationDto })
    })
  }

  async getById(id: number): Promise<Screening> {
    return await this.cacheService.cached({
      key: CacheKeys.SCREENING(id),
      ttl: '1h',
      fn: async () => {
        const screening = await this.prismaService.screening.findUnique({ where: { id } })

        if (screening) {
          return screening
        } else {
          throw new NotFoundException(`Screening with id "${id}" not found`)
        }
      }
    })
  }

  async update(id: number, data: UpdateScreeningDto): Promise<Screening> {
    try {
      const screening = await this.prismaService.screening.update({ where: { id }, data })
      await this.cacheService.delete(CacheKeys.SCREENING(id))

      return screening
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(id: number): Promise<Screening> {
    try {
      const screening = await this.prismaService.screening.delete({ where: { id } })
      await this.cacheService.delete(CacheKeys.SCREENING(id))

      return screening
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
