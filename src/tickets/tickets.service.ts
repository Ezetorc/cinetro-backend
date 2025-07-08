import { Injectable } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { PrismaService } from '../common/services/prisma.service'
import { TicketWithCinemaId } from './entities/ticket-with-cinema-id.entity'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class TicketsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTicketDto) {
    return await catchTo(this.prismaService.ticket.create({ data }))
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
    return await catchTo(this.prismaService.ticket.update({ where: { id }, data }))
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.ticket.delete({ where: { id } }))
  }
}
