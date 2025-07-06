import { Module } from '@nestjs/common'
import { UserRolesService } from './user-roles.service'
import { UserRolesController } from './user-roles.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { PolicyService } from 'src/policy/policy.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [UserRolesController],
  exports: [UserRolesService],
  providers: [UserRolesService, PrismaService, PolicyService, TicketsService]
})
export class UserRolesModule {}
