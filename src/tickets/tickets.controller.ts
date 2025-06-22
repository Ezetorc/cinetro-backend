import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { Id } from '../common/decorators/id.decorator'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { UsePolicy } from 'src/common/decorators/use-policy.decorator'

@Controller('tickets')
export class TicketsController {
  constructor (private readonly ticketsService: TicketsService) {}

  @Post()
  // @OnlyEmployees()
  @UsePolicy('create', 'ticket')
  @ApiDescription('Returns the ticket created', HttpStatus.CREATED)
  create (@Body() createDto: CreateTicketDto) {
    return this.ticketsService.create(createDto)
  }

  @Get('user/:userId')
  // @OnlyRoles(RoleName.USER)
  // @UseGuards(UserOwnsResourceGuard)
  @UsePolicy('read', 'tickets:own')
  @ApiDescription('Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiDescription('Returns an array of user tickets', HttpStatus.OK)
  getOfUser (@Id('ofUser') userId: number) {
    return this.ticketsService.getOfUser(userId)
  }

  @Get()
  @ApiDescription('Returns an array of tickets')
  // @OnlyEmployees()
  @UsePolicy('read', 'tickets:all')
  getAll () {
    // Agregar filtrado por cinemaId
    return this.ticketsService.getAll()
  }

  @Get(':id')
  @ApiId('Id of the ticket')
  @ApiDescription('Ticket not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the ticket with the given id', HttpStatus.OK)
  // @OnlyEmployees()
  getById (@Id() id: number) {
    return this.ticketsService.getById(id)
  }

  @Patch(':id')
  @ApiId('Id of the ticket')
  @ApiDescription('Ticket not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the updated ticket', HttpStatus.OK)
  // @OnlyEmployees()
  update (@Id() id: number, @Body() updateDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiId('Id of the ticket')
  @ApiDescription('Ticket not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the deleted ticket', HttpStatus.OK)
  // @OnlyEmployees()
  delete (@Id() id: number) {
    return this.ticketsService.delete(id)
  }
}
