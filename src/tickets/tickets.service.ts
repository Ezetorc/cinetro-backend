import { Injectable } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { PrismaService } from '../common/services/prisma.service'

@Injectable()
export class TicketsService {
  constructor (private readonly prismaService: PrismaService) {}

  async create (data: CreateTicketDto) {
    try {
      return await this.prismaService.ticket.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getOfUser (userId: number) {
    return await this.prismaService.ticket.findMany({ where: { userId } })
  }

  async getAll () {
    return await this.prismaService.ticket.findMany()
  }

  async getById (id: number) {
    return await this.prismaService.ticket.findUnique({ where: { id } })
  }

  async update (id: number, data: UpdateTicketDto) {
    try {
      return await this.prismaService.ticket.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.prismaService.ticket.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
