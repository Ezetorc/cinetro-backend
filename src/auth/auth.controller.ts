import {
  Post,
  Body,
  Controller,
  UnauthorizedException,
  Get,
  Req,
  HttpStatus
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { UsersService } from 'src/users/users.service'
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface'
import { RegisterUserDto } from './dto/register-user.dto'
import { SanitizedUser } from 'src/users/entities/sanitized-user.entity'
import { ApiBody } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { Description } from 'src/common/decorators/description.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @Description('Returns JWT Token', HttpStatus.OK)
  @Description('Invalid credentials', HttpStatus.BAD_REQUEST)
  @ApiBody({ type: LoginUserDto })
  @Public()
  async login (@Body() loginDto: LoginUserDto) {
    const userData = await this.authService.login(loginDto)

    if (userData) {
      const sanitizedUser = new SanitizedUser(userData.user)

      return { ...userData, user: sanitizedUser }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  @Post('register')
  @Description('Returns JWT Token', HttpStatus.CREATED)
  @Description('Invalid credentials', HttpStatus.BAD_REQUEST)
  @Public()
  async register (@Body() registerDto: RegisterUserDto) {
    const userData = await this.authService.register(registerDto)

    if (userData) {
      const sanitizedUser = new SanitizedUser(userData.user)

      return { ...userData, user: sanitizedUser }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  @Get()
  @Description('Returns user data', HttpStatus.OK)
  @Description('Unauthorized', HttpStatus.UNAUTHORIZED)
  @Roles('USER', 'CASHIER', 'MANAGER', 'SUPPORT')
  async getSelf (@Req() request: AuthenticatedRequest) {
    const userId = request.user.id
    const user = await this.usersService.getById(userId)

    if (!user) return null

    const sanitizedUser = new SanitizedUser(user)

    return sanitizedUser
  }
}
