import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { PolicyService } from 'src/policy/policy.service'
import { TicketsService } from 'src/tickets/tickets.service'
import { CacheService } from 'src/common/services/cache.service'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, PolicyService, TicketsService, CacheService]
})
export class CategoriesModule {}
