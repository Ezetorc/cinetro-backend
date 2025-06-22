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
import { RegisterUserDto } from './dto/register-user.dto'
import { SanitizedUser } from 'src/users/entities/sanitized-user.entity'
import { ApiBody } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { ApiDescription } from 'src/common/decorators/api-description.decorator'
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.type'

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @ApiDescription('Returns JWT Token', HttpStatus.OK)
  @ApiDescription('Invalid credentials', HttpStatus.BAD_REQUEST)
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
  @ApiDescription('Returns JWT Token', HttpStatus.CREATED)
  @ApiDescription('Invalid credentials', HttpStatus.BAD_REQUEST)
  @Public()
  async register (@Body() registerDto: RegisterUserDto) {
    const userData = await this.authService.register(registerDto)

    if (userData) {
      return new SanitizedUser(userData.user)
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  @Get()
  @ApiDescription('Returns user data', HttpStatus.OK)
  @ApiDescription('Unauthorized', HttpStatus.UNAUTHORIZED)
  // @OnlyRoles(RoleName.USER, RoleName.CASHIER, RoleName.MANAGER)
  async getSelf (@Req() request: AuthenticatedRequest) {
    const userId = request.user.id
    const user = await this.usersService.getById(userId, 'withRoles')

    if (user) {
      return new SanitizedUser(user)
    } else {
      return null
    }
  }
}
