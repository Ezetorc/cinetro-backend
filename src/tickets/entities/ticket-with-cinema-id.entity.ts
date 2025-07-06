import { Ticket, TicketStatus } from '@prisma/client'

export class TicketWithCinemaId implements Ticket {
  id: number
  userId: number
  seatId: number
  screeningId: number
  status: TicketStatus | null
  reservedAt: Date | null
  cinemaId: number

  constructor(ticket: Ticket, cinemaId: number) {
    this.id = ticket.id
    this.userId = ticket.userId
    this.seatId = ticket.seatId
    this.screeningId = ticket.screeningId
    this.status = ticket.status
    this.reservedAt = ticket.reservedAt
    this.cinemaId = cinemaId
  }
}
