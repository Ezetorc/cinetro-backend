import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  ForbiddenException,
  Req
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { Id } from '../common/decorators/id.decorator'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'
import { ApiParam } from '@nestjs/swagger'
import { isEmployee } from 'src/common/utilities/is-employee.utility'
import { Request } from 'express'

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  // @OnlyEmployees()
  @UsePolicy('create', 'ticket')
  @ApiDescription('Returns the ticket created', HttpStatus.CREATED)
  create(@Body() createDto: CreateTicketDto) {
    return this.ticketsService.create(createDto)
  }

  @Get('own')
  @UsePolicy('read', 'ticket:own')
  @ApiDescription('Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiDescription('Returns an array of user tickets', HttpStatus.OK)
  @UsePolicy('read', 'ticket:own')
  getOfSelf(@Req() request: Request) {
    if (request.user) {
      return this.ticketsService.getOfUser(request.user.id)
    } else {
      return null
    }
  }

  @Get('/:cinemaId')
  @ApiParam({ name: 'cinemaId', description: 'Id of the cinema' })
  @ApiDescription('Returns an array of tickets of an specific cinema')
  @UsePolicy('read', 'ticket:of-cinema')
  getAllOfCinema(@Param('cinemaId', ParseIntPipe) cinemaId: number, @Req() request: Request) {
    const userWorksInCinema = request.user?.roles.some(
      (role) => isEmployee(role.name) && role.cinemaId === cinemaId
    )

    if (userWorksInCinema) {
      return this.ticketsService.getAllOfCinema(cinemaId)
    } else {
      throw new ForbiddenException()
    }
  }

  @Get(':id')
  @UsePolicy('read', 'ticket')
  @ApiId('Id of the ticket')
  @ApiDescription('Ticket not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the ticket with the given id', HttpStatus.OK)
  // @OnlyEmployees()
  getById(@Id() id: number) {
    return this.ticketsService.getById(id)
  }

  @Patch(':id')
  @UsePolicy('update', 'ticket')
  @ApiId('Id of the ticket')
  @ApiDescription('Ticket not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the updated ticket', HttpStatus.OK)
  // @OnlyEmployees()
  update(@Id() id: number, @Body() updateDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateDto)
  }

  @Delete(':id')
  @UsePolicy('delete', 'ticket')
  @ApiId('Id of the ticket')
  @ApiDescription('Ticket not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the deleted ticket', HttpStatus.OK)
  // @OnlyEmployees()
  delete(@Id() id: number) {
    return this.ticketsService.delete(id)
  }
}
