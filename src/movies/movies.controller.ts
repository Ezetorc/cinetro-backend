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
  HttpStatus
} from '@nestjs/common'
import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiPagination } from '../common/decorators/api-pagination.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { Id } from '../common/decorators/id.decorator'
import { ApiQuery } from '@nestjs/swagger'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UsePolicy('create', 'movie')
  @ApiDescription('Returns the movie created', HttpStatus.CREATED)
  create(@Body() createDto: CreateMovieDto) {
    return this.moviesService.create(createDto)
  }

  @Get()
  @UsePolicy('read', 'movie:all')
  @ApiQuery({
    name: 'forPreview',
    required: false,
    type: Boolean,
    description: 'If true, returns only preview data of movies'
  })
  @ApiDescription('Returns an array of movies')
  @ApiPagination()
  getAll(
    @Query('forPreview', new DefaultValuePipe(false), ParseBoolPipe)
    forPreview: boolean,
    @Query() paginationDto: PaginationDto
  ) {
    if (forPreview) {
      return this.moviesService.getAllForPreview(paginationDto)
    } else {
      return this.moviesService.getAll(paginationDto)
    }
  }

  @Get(':id')
  @UsePolicy('read', 'movie')
  @ApiId('Id of the movie to get')
  @ApiDescription('Movie not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the movie with the id given', HttpStatus.OK)
  getById(@Id() id: number) {
    return this.moviesService.getById(id)
  }

  @Patch(':id')
  @UsePolicy('update', 'movie')
  @ApiId('Id of the movie to update')
  @ApiDescription('Movie not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the movie updated', HttpStatus.OK)
  update(@Id() id: number, @Body() updateDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateDto)
  }

  @Delete(':id')
  @UsePolicy('delete', 'movie')
  @ApiId('Id of the movie to delete')
  @ApiDescription('Movie not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the movie deleted', HttpStatus.OK)
  delete(@Id() id: number) {
    return this.moviesService.delete(id)
  }
}
