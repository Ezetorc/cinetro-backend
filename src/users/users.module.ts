import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { UserRolesModule } from 'src/user-roles/user-roles.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [forwardRef(() => AuthModule), UserRolesModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService]
})
export class UsersModule {}
