import { Module } from '@nestjs/common'
import { PolicyService } from './policy.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  providers: [PolicyService, PrismaService, TicketsService],
  exports: [PolicyService]
})
export class PolicyModule {}
