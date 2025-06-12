import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/resources/common/services/prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersService } from 'src/resources/users/users.service'
import { JWT_SECRET } from 'src/settings'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    PrismaService,
    JwtService,
  ],
})
export class AuthModule {}
