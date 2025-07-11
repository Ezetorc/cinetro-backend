import { Module } from '@nestjs/common'
import { UserRolesService } from './user-roles.service'
import { UserRolesController } from './user-roles.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [UserRolesController],
  exports: [UserRolesService],
  providers: [UserRolesService, PrismaService, TicketsService]
})
export class UserRolesModule {}
