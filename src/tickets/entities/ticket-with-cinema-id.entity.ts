import { Ticket } from '@prisma/client'

export type TicketWithCinemaId = Ticket & { cinemaId: number }
