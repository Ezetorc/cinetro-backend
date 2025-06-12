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
import { RoomsService } from './rooms.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { IdParam } from '../common/decorators/id-param.decorator'
import { Description } from '../common/decorators/description.decorator'
import { Id } from '../common/decorators/id.decorator'
import { WithPagination } from '../common/decorators/with-pagination.decorator'
import { PaginationArgs } from '../common/dto/pagination-args.dto'

@Controller('rooms')
export class RoomsController {
  constructor (private readonly roomsService: RoomsService) {}

  @Post()
  @Description('Returns the room created', HttpStatus.CREATED)
  create (@Body() createDto: CreateRoomDto) {
    return this.roomsService.create(createDto)
  }

  @Get()
  @Description('Returns an array of rooms')
  @WithPagination()
  getAll (@Query() pagination: PaginationArgs) {
    return this.roomsService.getAll(pagination)
  }

  @Get(':id')
  @IdParam('Id of the room')
  @Description('Room not found', HttpStatus.NOT_FOUND)
  @Description('Returns the room with the given id', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.roomsService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the room')
  @Description('Room not found', HttpStatus.NOT_FOUND)
  @Description('Returns the updated room', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the room')
  @Description('Room not found', HttpStatus.NOT_FOUND)
  @Description('Returns the deleted room', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.roomsService.delete(id)
  }
}
