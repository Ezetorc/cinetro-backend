import { UseGuards, Post, Req, Body, Get, Controller } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { JwtAuthGuard } from './guard/jwt-auth.guard'
import { AuthService } from './auth.service'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('login')
  async login (@Req() request: Request) {
    console.log('user: ', request.user)

    return this.authService.login(request.user as any)
  }

  @Post('register')
  async register (@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser (@Req() request: Request) {
    return request.user
  }

  // AAAAAAAAAAAAAA
}
