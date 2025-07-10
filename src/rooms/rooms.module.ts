import { CacheService } from './../common/services/cache.service'
import { Module } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { RoomsController } from './rooms.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { PolicyService } from 'src/policy/policy.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService, PolicyService, TicketsService, CacheService]
})
export class RoomsModule {}
