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
import { ScreeningsService } from './screenings.service'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'

@Controller('screenings')
export class ScreeningsController {
  constructor (private readonly screeningsService: ScreeningsService) {}

  @Post()
  createScreening (@Body() createScreeningDto: CreateScreeningDto) {
    return this.screeningsService.createScreening(createScreeningDto)
  }

  @Get()
  getAllScreenings () {
    return this.screeningsService.getAllScreenings()
  }

  @Get(':id')
  getScreeningById (@Param('id', ParseIntPipe) id: number) {
    return this.screeningsService.getScreeningById(id)
  }

  @Patch(':id')
  updateScreening (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScreeningDto: UpdateScreeningDto,
  ) {
    return this.screeningsService.updateScreening(id, updateScreeningDto)
  }

  @Delete(':id')
  deleteScreening (@Param('id', ParseIntPipe) id: number) {
    return this.screeningsService.deleteScreening(id)
  }
}
