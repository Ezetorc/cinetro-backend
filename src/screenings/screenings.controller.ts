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
import { ScreeningsService } from './screenings.service'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { Description } from '../common/decorators/description.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'
import { Id } from '../common/decorators/id.decorator'
import { WithPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'

@Controller('screenings')
export class ScreeningsController {
  constructor (private readonly screeningsService: ScreeningsService) {}

  @Post()
  @Description('Returns the screening created', HttpStatus.CREATED)
  create (@Body() createDto: CreateScreeningDto) {
    return this.screeningsService.create(createDto)
  }

  @Get()
  @Description('Returns an array of screenings')
  @WithPagination()
  getAll (@Query() pagination: PaginationArgs) {
    return this.screeningsService.getAll(pagination)
  }

  @Get(':id')
  @IdParam('Id of the screening')
  @Description('Screening not found', HttpStatus.NOT_FOUND)
  @Description('Returns the screening with the given id', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.screeningsService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the screening')
  @Description('Screening not found', HttpStatus.NOT_FOUND)
  @Description('Returns the updated screening', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateScreeningDto) {
    return this.screeningsService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('If of the screening')
  @Description('Screening not found', HttpStatus.NOT_FOUND)
  @Description('Returns the deleted screening', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.screeningsService.delete(id)
  }
}
