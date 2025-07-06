import { Injectable } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { PrismaService } from '../common/services/prisma.service'
import { TicketWithCinemaId } from './entities/ticket-with-cinema-id.entity'

@Injectable()
export class TicketsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTicketDto) {
    try {
      return await this.prismaService.ticket.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getOfUser(userId: number) {
    return await this.prismaService.ticket.findMany({ where: { userId } })
  }

  async getOfUserWithCinemaId(userId: number) {
    const tickets = await this.prismaService.ticket.findMany({
      where: { userId },
      include: {
        screening: {
          include: {
            room: {
              select: {
                cinemaId: true
              }
            }
          }
        }
      }
    })

    return tickets.map((ticket) => {
      return new TicketWithCinemaId(ticket, ticket.screening.room.cinemaId)
    })
  }

  async getAllOfCinema(cinemaId: number) {
    return await this.prismaService.ticket.findMany({
      where: {
        screening: {
          room: {
            cinemaId
          }
        }
      }
    })
  }

  async getById(id: number) {
    return await this.prismaService.ticket.findUnique({ where: { id } })
  }

  async getByIdWithCinemaId(id: number) {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
      include: {
        screening: {
          include: {
            room: {
              select: {
                cinemaId: true
              }
            }
          }
        }
      }
    })

    if (!ticket) return null

    return new TicketWithCinemaId(ticket, ticket.screening.room.cinemaId)
  }

  async update(id: number, data: UpdateTicketDto) {
    try {
      return await this.prismaService.ticket.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.ticket.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
