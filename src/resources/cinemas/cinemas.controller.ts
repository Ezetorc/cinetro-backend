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
import { CinemasService } from './cinemas.service'
import { CreateCinemaDto } from './dto/create-cinema.dto'
import { UpdateCinemaDto } from './dto/update-cinema.dto'
import { Public } from 'src/resources/common/decorators/public.decorator'
import { Description } from '../common/decorators/description.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'
import { Id } from '../common/decorators/id.decorator'
import { WithPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'

@Controller('cinemas')
export class CinemasController {
  constructor (private readonly cinemasService: CinemasService) {}

  @Post()
  @Description('Returns the cinema created', HttpStatus.CREATED)
  create (@Body() createDto: CreateCinemaDto) {
    return this.cinemasService.create(createDto)
  }

  @Get()
  @Description('Returns an array of cinemas')
  @WithPagination()
  @Public()
  getAll (@Query() pagination: PaginationArgs) {
    return this.cinemasService.getAll(pagination)
  }

  @Get(':id')
  @IdParam('Id of the cinema')
  @Description('Cinema not found', HttpStatus.NOT_FOUND)
  @Description('Returns the cinema with the id given', HttpStatus.OK)
  @Public()
  getById (@Id() id: number) {
    return this.cinemasService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the cinema')
  @Description('Cinema not found', HttpStatus.NOT_FOUND)
  @Description('Returns the cinema updated', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateCinemaDto) {
    return this.cinemasService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the cinema')
  @Description('Cinema not found', HttpStatus.NOT_FOUND)
  @Description('Returns the cinema created', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.cinemasService.delete(id)
  }
}
