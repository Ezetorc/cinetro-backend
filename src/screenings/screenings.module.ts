import { Module } from '@nestjs/common'
import { ScreeningsService } from './screenings.service'
import { ScreeningsController } from './screenings.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { CacheService } from 'src/common/services/cache.service'

@Module({
  controllers: [ScreeningsController],
  providers: [ScreeningsService, PrismaService, CacheService]
})
export class ScreeningsModule {}
