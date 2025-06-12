import { Module } from '@nestjs/common'
import { ScreeningsService } from './screenings.service'
import { ScreeningsController } from './screenings.controller'
import { PrismaService } from 'src/resources/common/services/prisma.service'

@Module({
  controllers: [ScreeningsController],
  providers: [ScreeningsService, PrismaService],
})
export class ScreeningsModule {}
