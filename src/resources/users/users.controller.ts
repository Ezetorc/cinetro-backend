import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Id } from '../common/decorators/id.decorator'
import { Description } from '../common/decorators/description.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  @Description('Returns the user created', HttpStatus.CREATED)
  create (@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto)
  }

  @Get()
  @Description('Returns an array of users')
  getAll () {
    return this.usersService.getAll()
  }

  @Get(':id')
  @IdParam('Id of the user')
  @Description('User not found', HttpStatus.NOT_FOUND)
  @Description('Returns the user with the given id', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.usersService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the user')
  @Description('User not found', HttpStatus.NOT_FOUND)
  @Description('Returns the updated user', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the user')
  @Description('User not found', HttpStatus.NOT_FOUND)
  @Description('Returns the deleted user', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.usersService.delete(id)
  }
}
