import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  providers: [PrismaService, TicketsService]
})
export class PolicyModule {}
