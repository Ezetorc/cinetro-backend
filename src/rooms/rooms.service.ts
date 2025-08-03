import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { Room } from '@prisma/client'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { PaginateResponse } from 'src/common/types/paginate-response.type'

@Injectable()
export class RoomsService {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService
  ) {}

  async create(data: CreateRoomDto): Promise<Room> {
    try {
      return await this.prismaService.room.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginateResponse<Room>> {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_ROOMS(paginationDto),
      ttl: '1d',
      fn: () => this.prismaService.paginate<Room>({ model: 'room', dto: paginationDto })
    })
  }

  async getById(id: number): Promise<Room> {
    const room = await this.prismaService.room.findUnique({ where: { id } })

    if (room) {
      return room
    } else {
      throw new NotFoundException(`Room with id "${id}" not found`)
    }
  }

  async update(id: number, data: UpdateRoomDto): Promise<Room> {
    try {
      return await this.prismaService.room.update({ where: { id }, data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(id: number): Promise<Room> {
    try {
      return await this.prismaService.room.delete({ where: { id } })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
