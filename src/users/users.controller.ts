import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Id } from '../common/decorators/id.decorator'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { SanitizedUser } from './entities/sanitized-user.entity'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  @ApiDescription('Returns the user created', HttpStatus.CREATED)
  async create (@Body() createDto: CreateUserDto) {
    const user = await this.usersService.create(createDto, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      return null
    }
  }

  @Get()
  @ApiDescription('Returns an array of users')
  async getAll () {
    const users = await this.usersService.getAll('withRoles')

    return SanitizedUser.getMany(users)
  }

  @Get(':id')
  @ApiId('Id of the user')
  @ApiDescription('User not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the user with the given id', HttpStatus.OK)
  async getById (@Id() id: number) {
    const user = await this.usersService.getById(id, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      return null
    }
  }

  @Patch(':id')
  @ApiId('Id of the user')
  @ApiDescription('User not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the updated user', HttpStatus.OK)
  async update (@Id() id: number, @Body() updateDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateDto, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      return null
    }
  }

  @Delete(':id')
  @ApiId('Id of the user')
  @ApiDescription('User not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the deleted user', HttpStatus.OK)
  async delete (@Id() id: number) {
    const user = await this.usersService.delete(id, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      return null
    }
  }
}
