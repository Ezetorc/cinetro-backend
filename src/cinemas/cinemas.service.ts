import { Injectable } from '@nestjs/common'
import { CreateCinemaDto } from './dto/create-cinema.dto'
import { UpdateCinemaDto } from './dto/update-cinema.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { Cinema } from '@prisma/client'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class CinemasService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateCinemaDto) {
    return await this.prismaService.cinema.create({ data })
  }

  async getAll(paginationDto: PaginationDto) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_CINEMAS(paginationDto),
      ttl: '1d',
      fn: () =>
        this.prismaService.paginate<Cinema>({
          model: 'cinema',
          dto: paginationDto
        })
    })
  }

  async getById(id: number) {
    return await this.cacheService.cached({
      key: CacheKeys.CINEMA(id),
      ttl: '1d',
      fn: () => this.prismaService.cinema.findUnique({ where: { id } })
    })
  }

  async update(id: number, data: UpdateCinemaDto) {
    return await catchTo(this.prismaService.cinema.update({ where: { id }, data }))
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.cinema.delete({ where: { id } }))
  }
}
