import { Ticket, UserRole } from '@prisma/client'
import { RoleName } from 'src/common/enums/role-name.enum'
import { Policy } from 'src/policy/entities/policy.entity'
import { TicketWithCinemaId } from 'src/tickets/entities/ticket-with-cinema-id.entity'

export const policy = new Policy()
const admin = policy.addRole(RoleName.ADMIN)
const operator = policy.addRole(RoleName.OPERATOR)
const manager = policy.addRole(RoleName.MANAGER)
const cashier = policy.addRole(RoleName.CASHIER)
const user = policy.addRole(RoleName.USER)

admin.can('manage', 'all')

operator
  .extends(manager)
  .canAlso('create', 'user-role')
  .if<UserRole>((user, userRole) => userRole.userId === user.id)

cashier
  .can('manage', 'ticket:of-cinema')
  .if<TicketWithCinemaId>((user, resource) => user.worksInCinema(resource.cinemaId))

user
  .can('read', 'ticket:own')
  .if<Ticket>((user, ticket) => user.id === ticket.userId)
  .canAlso('read', 'screening:all')
  .canAlso('read', 'user:own')
  .canAlso('create', 'user:authorization')
  .canAlso('create', 'user:own')

policy.anyone.can('read', 'movie:all').canAlso('read', 'movie')
