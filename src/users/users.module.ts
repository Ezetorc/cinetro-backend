import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { UserRolesModule } from 'src/user-roles/user-roles.module'
import { AuthModule } from 'src/auth/auth.module'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  imports: [forwardRef(() => AuthModule), UserRolesModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, TicketsService],
  exports: [UsersService]
})
export class UsersModule {}
