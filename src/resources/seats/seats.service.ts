import { Injectable } from '@nestjs/common'
import { CreateSeatDto } from './dto/create-seat.dto'
import { UpdateSeatDto } from './dto/update-seat.dto'
import { PrismaService } from 'src/resources/common/services/prisma.service'
import { ErrorHandler } from 'src/resources/common/helpers/error-handler.helper'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { Seat } from '@prisma/client'

@Injectable()
export class SeatsService {
  constructor (private readonly prismaService: PrismaService) {}

  async create (data: CreateSeatDto) {
    try {
      return await this.prismaService.seat.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getAll (paginationArgs: PaginationArgs) {
    return await this.prismaService.paginate<Seat>({
      model: 'seat',
      paginationArgs,
    })
  }

  async getById (id: number) {
    return await this.prismaService.seat.findUnique({ where: { id } })
  }

  async update (id: number, data: UpdateSeatDto) {
    try {
      return await this.prismaService.seat.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.prismaService.seat.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
