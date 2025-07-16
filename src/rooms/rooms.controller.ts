import { Controller, Get, Post, Body, Patch, Delete, HttpStatus, Query } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { ApiId } from '../common/decorators/api-id.decorator'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { Id } from '../common/decorators/id.decorator'
import { ApiPagination } from '../common/decorators/api-pagination.decorator'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UsePolicy('create', 'room')
  @ApiDescription('Returns the room created', HttpStatus.CREATED)
  create(@Body() createDto: CreateRoomDto) {
    return this.roomsService.create(createDto)
  }

  @Get()
  @UsePolicy('read', 'room:all')
  @ApiDescription('Returns an array of rooms')
  @ApiPagination()
  getAll(@Query() paginationDto: PaginationDto) {
    return this.roomsService.getAll(paginationDto)
  }

  @Get(':id')
  @UsePolicy('read', 'room')
  @ApiId('Id of the room')
  @ApiDescription('Room not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the room with the given id', HttpStatus.OK)
  getById(@Id() id: number) {
    return this.roomsService.getById(id)
  }

  @Patch(':id')
  @UsePolicy('update', 'room')
  @ApiId('Id of the room')
  @ApiDescription('Room not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the updated room', HttpStatus.OK)
  update(@Id() id: number, @Body() updateDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateDto)
  }

  @Delete(':id')
  @UsePolicy('delete', 'room')
  @ApiId('Id of the room')
  @ApiDescription('Room not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the deleted room', HttpStatus.OK)
  delete(@Id() id: number) {
    return this.roomsService.delete(id)
  }
}
