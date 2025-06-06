import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'

@Controller('rooms')
export class RoomsController {
  constructor (private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom (@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.createRoom(createRoomDto)
  }

  @Get()
  getAllRooms () {
    return this.roomsService.getAllRooms()
  }

  @Get(':id')
  getRoomById (@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.getRoomById(id)
  }

  @Patch(':id')
  updateRoom (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.updateRoom(id, updateRoomDto)
  }

  @Delete(':id')
  deleteRoom (@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.deleteRoom(id)
  }
}
