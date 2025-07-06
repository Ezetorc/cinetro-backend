import { Module } from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { PolicyModule } from 'src/policy/policy.module'

@Module({
  controllers: [TicketsController],
  imports: [PolicyModule],
  providers: [TicketsService, PrismaService]
})
export class TicketsModule {}
