import { Injectable } from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { Room } from '@prisma/client'

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateRoomDto) {
    try {
      return await this.prismaService.room.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getAll(paginationArgs: PaginationArgs) {
    return await this.prismaService.paginate<Room>({
      model: 'room',
      paginationArgs
    })
  }

  async getById(id: number) {
    return await this.prismaService.room.findUnique({ where: { id } })
  }

  async update(id: number, data: UpdateRoomDto) {
    try {
      return await this.prismaService.room.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.room.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
