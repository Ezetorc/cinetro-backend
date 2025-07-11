import { Module } from '@nestjs/common'
import { SeatsService } from './seats.service'
import { SeatsController } from './seats.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [SeatsController],
  providers: [SeatsService, PrismaService, TicketsService]
})
export class SeatsModule {}
