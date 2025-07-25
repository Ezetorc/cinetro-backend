import { Post, Body, Controller, UnauthorizedException, Get, Req, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { UsersService } from 'src/users/users.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { SanitizedUser } from 'src/users/entities/sanitized-user.entity'
import { ApiBody } from '@nestjs/swagger'
import { ApiDescription } from 'src/common/decorators/api-description.decorator'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @UsePolicy('create', 'user:authorization')
  @ApiDescription('Returns JWT Token and user', HttpStatus.OK)
  @ApiDescription('Invalid credentials', HttpStatus.BAD_REQUEST)
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginDto: LoginUserDto) {
    const userData = await this.authService.login(loginDto)

    if (userData) {
      const sanitizedUser = new SanitizedUser(userData.user)

      return { ...userData, user: sanitizedUser }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  @Post('register')
  @UsePolicy('create', 'user:own')
  @ApiDescription('Returns JWT Token and user', HttpStatus.CREATED)
  @ApiDescription('Invalid credentials', HttpStatus.BAD_REQUEST)
  async register(@Body() registerDto: RegisterUserDto) {
    const userData = await this.authService.register(registerDto)

    if (userData) {
      const sanitizedUser = new SanitizedUser(userData.user)

      return { ...userData, user: sanitizedUser }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  @Get()
  @UsePolicy('read', 'user:own')
  @ApiDescription('Returns user data', HttpStatus.OK)
  @ApiDescription('Unauthorized', HttpStatus.UNAUTHORIZED)
  async getSelf(@Req() request: Request) {
    const userId = request.user?.id

    if (userId === undefined) return null

    const user = await this.usersService.getById(userId, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      return null
    }
  }
}
