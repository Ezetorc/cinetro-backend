import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { PrismaService } from '../common/services/prisma.service'
import { Ticket } from '@prisma/client'

@Injectable()
export class TicketsService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateTicketDto): Promise<Ticket> {
    try {
      return await this.prismaService.ticket.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async getOfUser(userId: number): Promise<Ticket[]> {
    return await this.prismaService.ticket.findMany({ where: { userId } })
  }

  async getAllOfCinema(cinemaId: number): Promise<Ticket[]> {
    return await this.prismaService.ticket.findMany({
      where: { screening: { room: { cinemaId } } }
    })
  }

  async getById(id: number): Promise<Ticket> {
    const ticket = await this.prismaService.ticket.findUnique({ where: { id } })

    if (ticket) {
      return ticket
    } else {
      throw new NotFoundException(`Ticket with id "${id}" not found`)
    }
  }

  async update(id: number, data: UpdateTicketDto): Promise<Ticket> {
    try {
      return await this.prismaService.ticket.update({ where: { id }, data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(id: number): Promise<Ticket> {
    try {
      return await this.prismaService.ticket.delete({ where: { id } })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
