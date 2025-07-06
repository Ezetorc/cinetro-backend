import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Resource } from './types/resource.type'
import { TicketsService } from 'src/tickets/tickets.service'

@Injectable()
export class PolicyService {
  constructor(private readonly ticketsService: TicketsService) {}

  async 'ticket:own'(request: Request) {
    if (request.user?.id) {
      return await this.ticketsService.getOfUser(request.user.id)
    }

    return null
  }

  async 'ticket:of-cinema'(request: Request) {
    if (request.params.id) {
      return await this.ticketsService.getByIdWithCinemaId(parseInt(request.params.id))
    } else if (request.user?.id) {
      return await this.ticketsService.getOfUserWithCinemaId(request.user.id)
    }

    return null
  }

  async getResource(resource: Resource, request: Request) {
    if (resource === 'all' || request === null) return null

    const method = this[resource] as ((request: Request) => Promise<object | null>) | null

    if (!method) return null

    return (await method.call(this, request)) as object | null
  }
}
