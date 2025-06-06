import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard'
import { Request } from 'express'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  createUser (@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @Get()
  getAllUsers () {
    return this.usersService.getAllUsers()
  }

  @Get(':id')
  getUserById (@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id)
  }

  @Patch(':id')
  updateUser (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  deleteUser (@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id)
  }
}
