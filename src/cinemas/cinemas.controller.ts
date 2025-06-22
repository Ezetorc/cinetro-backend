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
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { Id } from '../common/decorators/id.decorator'
import { ApiPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { Public } from 'src/common/decorators/public.decorator'

@Controller('cinemas')
export class CinemasController {
  constructor (private readonly cinemasService: CinemasService) {}

  @Post()
  @ApiDescription('Returns the cinema created', HttpStatus.CREATED)
  create (@Body() createDto: CreateCinemaDto) {
    return this.cinemasService.create(createDto)
  }

  @Get()
  @ApiDescription('Returns an array of cinemas')
  @ApiPagination()
  @Public()
  getAll (@Query() pagination: PaginationArgs) {
    return this.cinemasService.getAll(pagination)
  }

  @Get(':id')
  @ApiId('Id of the cinema')
  @ApiDescription('Cinema not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the cinema with the id given', HttpStatus.OK)
  @Public()
  getById (@Id() id: number) {
    return this.cinemasService.getById(id)
  }

  @Patch(':id')
  @ApiId('Id of the cinema')
  @ApiDescription('Cinema not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the cinema updated', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateCinemaDto) {
    return this.cinemasService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiId('Id of the cinema')
  @ApiDescription('Cinema not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the cinema created', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.cinemasService.delete(id)
  }
}
