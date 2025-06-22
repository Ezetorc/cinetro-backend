import { forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Module } from '@nestjs/common'
import { UserRolesService } from 'src/user-roles/user-roles.service'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PrismaService } from 'src/common/services/prisma.service'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: { expiresIn: '24h' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRolesService, PrismaService],
  exports: [AuthService]
})
export class AuthModule {}
