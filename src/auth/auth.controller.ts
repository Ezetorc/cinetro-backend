import {
  Post,
  Body,
  Controller,
  Get,
  Req,
  HttpStatus,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { UsersService } from 'src/users/users.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { SanitizedUser } from 'src/users/entities/sanitized-user.entity'
import { ApiDescription } from 'src/common/decorators/api-description.decorator'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  @UsePolicy('create', 'user:authorization')
  @ApiDescription('Returns authorization token and user', HttpStatus.OK)
  @ApiDescription('Invalid credentials', HttpStatus.BAD_REQUEST)
  @ApiDescription('User not found', HttpStatus.NOT_FOUND)
  async login(@Body() loginDto: LoginUserDto) {
    const loginResponse = await this.authService.login(loginDto)
    const sanitizedUser = new SanitizedUser(loginResponse.user)

    return { ...loginResponse, user: sanitizedUser }
  }

  @Post('register')
  @UsePolicy('create', 'user:own')
  @ApiDescription('Returns authorization and user', HttpStatus.OK)
  @ApiDescription('Invalid credentials', HttpStatus.BAD_REQUEST)
  @ApiDescription('Email already in use', HttpStatus.CONFLICT)
  async register(@Body() registerDto: RegisterUserDto) {
    const registerResponse = await this.authService.register(registerDto)
    const sanitizedUser = new SanitizedUser(registerResponse.user)

    return { ...registerResponse, user: sanitizedUser }
  }

  @Get()
  @UsePolicy('read', 'user:own')
  @ApiDescription('Returns user data', HttpStatus.OK)
  @ApiDescription('You are not logged', HttpStatus.UNAUTHORIZED)
  @ApiDescription('User not found', HttpStatus.NOT_FOUND)
  async getSelf(@Req() request: Request) {
    if (request.user?.id === undefined) throw new UnauthorizedException('You are not logged')

    const user = await this.usersService.getById(request.user?.id, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      throw new NotFoundException('User not found')
    }
  }
}
