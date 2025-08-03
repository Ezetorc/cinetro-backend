import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSeatDto } from './dto/create-seat.dto'
import { UpdateSeatDto } from './dto/update-seat.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { Seat } from '@prisma/client'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { PaginateResponse } from 'src/common/types/paginate-response.type'

@Injectable()
export class SeatsService {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService
  ) {}

  async create(data: CreateSeatDto): Promise<Seat> {
    try {
      return await this.prismaService.seat.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginateResponse<Seat>> {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_SEATS(paginationDto),
      ttl: '1d',
      fn: () => this.prismaService.paginate<Seat>({ model: 'seat', dto: paginationDto })
    })
  }

  async getById(id: number): Promise<Seat> {
    return await this.cacheService.cached({
      key: CacheKeys.SEAT(id),
      ttl: '1d',
      fn: async () => {
        const seat = await this.prismaService.seat.findUnique({ where: { id } })

        if (seat) {
          return seat
        } else {
          throw new NotFoundException(`Seat with id "${id}" not found`)
        }
      }
    })
  }

  async update(id: number, data: UpdateSeatDto): Promise<Seat> {
    try {
      const seat = await this.prismaService.seat.update({ where: { id }, data })
      await this.cacheService.delete(CacheKeys.SEAT(id))

      return seat
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(id: number): Promise<Seat> {
    try {
      const seat = await this.prismaService.seat.delete({ where: { id } })
      await this.cacheService.delete(CacheKeys.SEAT(id))

      return seat
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
