import { Injectable } from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { Room } from '@prisma/client'
import { catchTo } from 'src/common/utilities/catch-to.utility'
import { CacheService } from 'src/common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'

@Injectable()
export class RoomsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateRoomDto) {
    return await catchTo(this.prismaService.room.create({ data }))
  }

  async getAll(paginationDto: PaginationDto) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_ROOMS(paginationDto),
      ttl: '1d',
      fn: () => this.prismaService.paginate<Room>({ model: 'room', dto: paginationDto })
    })
  }

  async getById(id: number) {
    return await this.prismaService.room.findUnique({ where: { id } })
  }

  async update(id: number, data: UpdateRoomDto) {
    return await catchTo(this.prismaService.room.update({ where: { id }, data }))
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.room.delete({ where: { id } }))
  }
}
