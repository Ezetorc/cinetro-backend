import { Movie, Ticket } from '@prisma/client'
import { Policy } from 'src/common/helpers/policy.helper'

export const policy = new Policy()

policy.admin.canManage('all')

policy.manager
  .canCreate('tickets:of-his-cinema')
  .if<Ticket>((user, ticket) => user.id === ticket.userId)
  .canAlsoDelete('tickets:of-his-cinema')
  .if<Ticket>((user, ticket) => user.id === ticket.userId)
  .canAlsoCreate('movies:of-his-cinema')
  .if<Movie>((user, movie) => user.id === movie.id)
  .canAlsoUpdate('movies:of-his-cinema')
  .if<Movie>((user, movie) => user.id === movie.id)

policy.cashier
  .canRead('ticket')
  .canAlsoUpdate('ticket')
  .if<Ticket>((_user, ticket) => ticket.status === 'RESERVED')
  .canAlsoCreate('ticket')

policy.user
  .canRead('movie')
  .canAlsoCreate('ticket')
  .if<Ticket>((user, ticket) => user.id === ticket.userId)
  .canAlsoDelete('ticket')
  .if<Ticket>((user, ticket) => user.id === ticket.userId)
  .canAlsoUpdate('ticket')
  .if<Ticket>((user, ticket) => user.id === ticket.userId)

