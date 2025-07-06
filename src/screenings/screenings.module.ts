import { Module } from '@nestjs/common'
import { ScreeningsService } from './screenings.service'
import { ScreeningsController } from './screenings.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { CacheService } from 'src/common/services/cache.service'
import { PolicyService } from 'src/policy/policy.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [ScreeningsController],
  providers: [ScreeningsService, PrismaService, CacheService, PolicyService, TicketsService]
})
export class ScreeningsModule {}
