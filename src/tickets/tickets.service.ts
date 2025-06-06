import { Injectable } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'

@Injectable()
export class TicketsService {
  constructor (private readonly database: PrismaService) {}

  async createTicket (createTicketDto: CreateTicketDto) {
    try {
      return await this.database.ticket.create({ data: createTicketDto })
    } catch (error) {
      ErrorHandler.handleNotFound(
        error,
        `User with id ${createTicketDto.userId} or seat with id ${createTicketDto.seatId} or screening with id ${createTicketDto.screeningId} not found`,
      )
    }
  }

  async getAllTickets () {
    return await this.database.ticket.findMany()
  }

  async getTicketById (id: number) {
    return await this.database.ticket.findUnique({ where: { id } })
  }

  async updateTicket (id: number, updateTicketDto: UpdateTicketDto) {
    try {
      return await this.database.ticket.update({
        where: { id },
        data: updateTicketDto,
      })
    } catch (error) {
      ErrorHandler.handleNotFound(
        error,
        `Ticket with id ${id} or user with id ${updateTicketDto.userId} or seat with id ${updateTicketDto.seatId} or screening with id ${updateTicketDto.screeningId} not found`,
      )
    }
  }

  async deleteTicket (id: number) {
    try {
      return await this.database.ticket.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Ticket with id ${id} not found`)
    }
  }
}
