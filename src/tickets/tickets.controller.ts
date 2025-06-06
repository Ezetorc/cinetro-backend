import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'

@Controller('tickets')
export class TicketsController {
  constructor (private readonly ticketsService: TicketsService) {}

  @Post()
  createTicket (@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto)
  }

  @Get()
  getAllTickets () {
    return this.ticketsService.getAllTickets()
  }

  @Get(':id')
  getTicketById (@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.getTicketById(id)
  }

  @Patch(':id')
  updateTicket (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.updateTicket(id, updateTicketDto)
  }

  @Delete(':id')
  deleteTicket (@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.deleteTicket(id)
  }
}
