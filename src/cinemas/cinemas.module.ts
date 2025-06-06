import { Module } from '@nestjs/common'
import { CinemasService } from './cinemas.service'
import { CinemasController } from './cinemas.controller'
import { PrismaService } from 'src/common/services/prisma.service'

@Module({
  controllers: [CinemasController],
  providers: [CinemasService, PrismaService],
})
export class CinemasModule {}
