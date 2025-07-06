import { Controller, Get, Post, Body, Patch, Delete, HttpStatus, Query } from '@nestjs/common'
import { SeatsService } from './seats.service'
import { CreateSeatDto } from './dto/create-seat.dto'
import { UpdateSeatDto } from './dto/update-seat.dto'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { Id } from '../common/decorators/id.decorator'
import { ApiPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  @UsePolicy('create', 'seat')
  @ApiDescription('Returns the seat created', HttpStatus.CREATED)
  create(@Body() createDto: CreateSeatDto) {
    return this.seatsService.create(createDto)
  }

  @Get()
  @UsePolicy('read', 'seat:all')
  @ApiDescription('Returns an array of seats')
  @ApiPagination()
  getAll(@Query() pagination: PaginationArgs) {
    return this.seatsService.getAll(pagination)
  }

  @Get(':id')
  @UsePolicy('read', 'seat')
  @ApiId('Id of the seat')
  @ApiDescription('Seat not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the seat with the given id', HttpStatus.OK)
  getById(@Id() id: number) {
    return this.seatsService.getById(id)
  }

  @Patch(':id')
  @UsePolicy('update', 'seat')
  @ApiId('Id of the seat')
  @ApiDescription('Seat not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the updated seat', HttpStatus.OK)
  update(@Id() id: number, @Body() updateDto: UpdateSeatDto) {
    return this.seatsService.update(id, updateDto)
  }

  @Delete(':id')
  @UsePolicy('delete', 'seat')
  @ApiId('Id of the seat')
  @ApiDescription('Seat not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the deleted seat', HttpStatus.OK)
  delete(@Id() id: number) {
    return this.seatsService.delete(id)
  }
}
