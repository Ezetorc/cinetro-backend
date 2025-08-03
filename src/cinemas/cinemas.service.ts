import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCinemaDto } from './dto/create-cinema.dto'
import { UpdateCinemaDto } from './dto/update-cinema.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { Cinema } from '@prisma/client'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { PaginateResponse } from 'src/common/types/paginate-response.type'

@Injectable()
export class CinemasService {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService
  ) {}

  async create(data: CreateCinemaDto): Promise<Cinema> {
    try {
      return await this.prismaService.cinema.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginateResponse<Cinema>> {
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

  async getById(id: number): Promise<Cinema> {
    return await this.cacheService.cached({
      key: CacheKeys.CINEMA(id),
      ttl: '1d',
      fn: async () => {
        const cinema = await this.prismaService.cinema.findUnique({ where: { id } })

        if (cinema) {
          return cinema
        } else {
          throw new NotFoundException(`Cinema with id "${id}" not found`)
        }
      }
    })
  }

  async update(id: number, data: UpdateCinemaDto): Promise<Cinema> {
    try {
      const cinema = await this.prismaService.cinema.update({ where: { id }, data })
      await this.cacheService.delete(CacheKeys.CINEMA(id))

      return cinema
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(id: number): Promise<Cinema> {
    try {
      const cinema = await this.prismaService.cinema.delete({ where: { id } })
      await this.cacheService.delete(CacheKeys.CINEMA(id))

      return cinema
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
