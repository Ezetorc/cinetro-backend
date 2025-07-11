import { Module } from '@nestjs/common'
import { CinemasService } from './cinemas.service'
import { CinemasController } from './cinemas.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { CacheService } from 'src/common/services/cache.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [CinemasController],
  providers: [CinemasService, PrismaService, CacheService, TicketsService]
})
export class CinemasModule {}
