import { Injectable } from '@nestjs/common'
import { CreateSeatDto } from './dto/create-seat.dto'
import { UpdateSeatDto } from './dto/update-seat.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'

@Injectable()
export class SeatsService {
  constructor (private readonly database: PrismaService) {}

  async createSeat (createSeatDto: CreateSeatDto) {
    try {
      return await this.database.seat.create({ data: createSeatDto })
    } catch (error) {
      ErrorHandler.handleNotFound(
        error,
        `Room with id ${createSeatDto.roomId} not found`,
      )
    }
  }

  async getAllSeats () {
    return await this.database.seat.findMany()
  }

  async getSeatById (id: number) {
    return await this.database.seat.findUnique({ where: { id } })
  }

  async updateSeat (id: number, updateSeatDto: UpdateSeatDto) {
    try {
      return await this.database.seat.update({
        where: { id },
        data: updateSeatDto,
      })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Seat with id ${id} not found`)
    }
  }

  async deleteSeat (id: number) {
    try {
      return await this.database.seat.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Seat with id ${id} not found`)
    }
  }
}
