import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'

@Injectable()
export class RoomsService {
  constructor (private readonly database: PrismaService) {}

  async createRoom (createRoomDto: CreateRoomDto) {
    try {
      return await this.database.room.create({ data: createRoomDto })
    } catch (error) {
      ErrorHandler.handleNotFound(
        error,
        `Cinema with id ${createRoomDto.cinemaId} not found`,
      )
    }
  }

  async getAllRooms () {
    return await this.database.room.findMany()
  }

  async getRoomById (id: number) {
    return await this.database.room.findUnique({ where: { id } })
  }

  async updateRoom (id: number, updateRoomDto: UpdateRoomDto) {
    try {
      return await this.database.room.update({
        where: { id },
        data: updateRoomDto,
      })
    } catch (error) {
      const message = updateRoomDto.cinemaId
        ? `Room with id ${id} or cinema with id ${updateRoomDto.cinemaId} not found`
        : `Room with id ${id} not found`

      ErrorHandler.handleNotFound(error, message)
    }
  }

  async deleteRoom (id: number) {
    try {
      return await this.database.room.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Room with id ${id} not found`)
    }
  }
}
