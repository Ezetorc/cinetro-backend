import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
  HttpStatus,
} from '@nestjs/common'
import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { Public } from 'src/resources/common/decorators/public.decorator'
import { PaginationArgs } from 'src/resources/common/dto/pagination-args.dto'
import { Description } from '../common/decorators/description.decorator'
import { WithPagination } from '../common/decorators/with-pagination.decorator'
import { BooleanOptionalQuery } from '../common/decorators/boolean-optional-query.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'
import { Id } from '../common/decorators/id.decorator'

@Controller('movies')
export class MoviesController {
  constructor (private readonly moviesService: MoviesService) {}

  @Post()
  @Description('Returns the movie created', HttpStatus.CREATED)
  create (@Body() createDto: CreateMovieDto) {
    return this.moviesService.create(createDto)
  }

  @Get()
  @BooleanOptionalQuery(
    'forPreview',
    'If true, returns only preview data of movies',
  )
  @Description('Returns an array of movies')
  @WithPagination()
  @Public()
  getAll (
    @Query('forPreview', new DefaultValuePipe(false), ParseBoolPipe)
    forPreview: boolean,
    @Query() pagination: PaginationArgs,
  ) {
    if (forPreview) {
      return this.moviesService.getAllForPreview(pagination)
    } else {
      return this.moviesService.getAll(pagination)
    }
  }

  @Get(':id')
  @IdParam('Id of the movie to get')
  @Description('Movie not found', HttpStatus.NOT_FOUND)
  @Description('Returns the movie with the id given', HttpStatus.OK)
  @Public()
  getById (@Id() id: number) {
    return this.moviesService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the movie to update')
  @Description('Movie not found', HttpStatus.NOT_FOUND)
  @Description('Returns the movie updated', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the movie to delete')
  @Description('Movie not found', HttpStatus.NOT_FOUND)
  @Description('Returns the movie deleted', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.moviesService.delete(id)
  }
}
