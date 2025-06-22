import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  Query
} from '@nestjs/common'
import { ScreeningsService } from './screenings.service'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { Id } from '../common/decorators/id.decorator'
import { ApiPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'

@Controller('screenings')
export class ScreeningsController {
  constructor (private readonly screeningsService: ScreeningsService) {}

  @Post()
  @ApiDescription('Returns the screening created', HttpStatus.CREATED)
  create (@Body() createDto: CreateScreeningDto) {
    return this.screeningsService.create(createDto)
  }

  @Get()
  @ApiDescription('Returns an array of screenings')
  @ApiPagination()
  getAll (@Query() pagination: PaginationArgs) {
    return this.screeningsService.getAll(pagination)
  }

  @Get(':id')
  @ApiId('Id of the screening')
  @ApiDescription('Screening not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the screening with the given id', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.screeningsService.getById(id)
  }

  @Patch(':id')
  @ApiId('Id of the screening')
  @ApiDescription('Screening not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the updated screening', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateScreeningDto) {
    return this.screeningsService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiId('If of the screening')
  @ApiDescription('Screening not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the deleted screening', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.screeningsService.delete(id)
  }
}
