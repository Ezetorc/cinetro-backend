import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { CinemasService } from './cinemas.service'
import { CreateCinemaDto } from './dto/create-cinema.dto'
import { UpdateCinemaDto } from './dto/update-cinema.dto'
import { ApiResponse } from '@nestjs/swagger'

@Controller('cinemas')
export class CinemasController {
  constructor (private readonly cinemasService: CinemasService) {}

  @Post()
  @ApiResponse({ description: 'Returns the cinema created' })
  create (@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto)
  }

  @Get()
  @ApiResponse({ description: 'Returns an array of cinemas' })
  getAll () {
    return this.cinemasService.getAll()
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  @ApiResponse({ description: 'Returns the cinema with the id given' })
  getById (@Param('id', ParseIntPipe) id: number) {
    return this.cinemasService.getById(id)
  }

  @Patch(':id')
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  @ApiResponse({ description: 'Returns the cinema updated' })
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ) {
    return this.cinemasService.update(id, updateCinemaDto)
  }

  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  @ApiResponse({ description: 'Returns the cinema created' })
  delete (@Param('id', ParseIntPipe) id: number) {
    return this.cinemasService.delete(id)
  }
}
