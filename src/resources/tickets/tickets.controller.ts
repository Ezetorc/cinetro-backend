import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { Roles } from 'src/resources/common/decorators/roles.decorator'
import { UserOwnsResourceGuard } from '../common/guards/user-owns-resource.guard'
import { Id } from '../common/decorators/id.decorator'
import { Description } from '../common/decorators/description.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'

@Controller('tickets')
export class TicketsController {
  constructor (private readonly ticketsService: TicketsService) {}

  @Post()
  @Description('Returns the ticket created', HttpStatus.CREATED)
  create (@Body() createDto: CreateTicketDto) {
    return this.ticketsService.create(createDto)
  }

  @Get('user/:userId')
  @Roles('USER')
  @UseGuards(UserOwnsResourceGuard)
  @Description('Unauthorized', HttpStatus.UNAUTHORIZED)
  @Description('Returns an array of user tickets', HttpStatus.OK)
  getOfUser (@Id('ofUser') userId: number) {
    return this.ticketsService.getOfUser(userId)
  }

  @Get()
  @Description('Returns an array of tickets')
  getAll () {
    return this.ticketsService.getAll()
  }

  @Get(':id')
  @IdParam('Id of the ticket')
  @Description('Ticket not found', HttpStatus.NOT_FOUND)
  @Description('Returns the ticket with the given id', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.ticketsService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the ticket')
  @Description('Ticket not found', HttpStatus.NOT_FOUND)
  @Description('Returns the updated ticket', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the ticket')
  @Description('Ticket not found', HttpStatus.NOT_FOUND)
  @Description('Returns the deleted ticket', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.ticketsService.delete(id)
  }
}
