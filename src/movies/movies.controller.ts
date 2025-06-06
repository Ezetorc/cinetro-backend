import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common'
import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

@Controller('movies')
export class MoviesController {
  constructor (private readonly moviesService: MoviesService) {}

  @Get()
  @ApiQuery({
    name: 'forPreview',
    required: false,
    type: Boolean,
    description: 'If true, returns only preview data of movies',
  })
  @ApiResponse({ description: 'Returns an array of movies' })
  getAllMovies (
    @Query('forPreview', new DefaultValuePipe(false), ParseBoolPipe)
    forPreview: boolean,
  ) {
    return this.moviesService.getAllMovies(forPreview)
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Id of the movie to get',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 200,
    description: 'Returns the movie with the id given',
  })
  getMovieById (@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieById(id)
  }

  @Post()
  @ApiResponse({ description: 'Returns the movie created' })
  createMovie (@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Id of the movie to update',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 200,
    description: 'Returns the movie updated',
  })
  updateMovie (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.updateMovie(id, updateMovieDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Id of the movie to delete',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 200,
    description: 'Returns the movie deleted',
  })
  deleteMovie (@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.deleteMovie(id)
  }
}
