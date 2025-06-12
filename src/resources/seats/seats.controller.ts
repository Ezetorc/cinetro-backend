import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { SeatsService } from './seats.service'
import { CreateSeatDto } from './dto/create-seat.dto'
import { UpdateSeatDto } from './dto/update-seat.dto'
import { Description } from '../common/decorators/description.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'
import { Id } from '../common/decorators/id.decorator'
import { WithPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'

@Controller('seats')
export class SeatsController {
  constructor (private readonly seatsService: SeatsService) {}

  @Post()
  @Description('Returns the seat created', HttpStatus.CREATED)
  create (@Body() createDto: CreateSeatDto) {
    return this.seatsService.create(createDto)
  }

  @Get()
  @Description('Returns an array of seats')
  @WithPagination()
  getAll (@Query() pagination: PaginationArgs) {
    return this.seatsService.getAll(pagination)
  }

  @Get(':id')
  @IdParam('Id of the seat')
  @Description('Seat not found', HttpStatus.NOT_FOUND)
  @Description('Returns the seat with the given id', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.seatsService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the seat')
  @Description('Seat not found', HttpStatus.NOT_FOUND)
  @Description('Returns the updated seat', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateSeatDto) {
    return this.seatsService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the seat')
  @Description('Seat not found', HttpStatus.NOT_FOUND)
  @Description('Returns the deleted seat', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.seatsService.delete(id)
  }
}
