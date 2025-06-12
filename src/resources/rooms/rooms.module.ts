import { Module } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { RoomsController } from './rooms.controller'
import { PrismaService } from 'src/resources/common/services/prisma.service'

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
})
export class RoomsModule {}
