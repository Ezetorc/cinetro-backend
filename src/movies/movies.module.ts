import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { MovieCategoriesService } from 'src/movie-categories/movie-categories.service'
import { CategoriesService } from 'src/categories/categories.service'
import { CacheService } from '../common/services/cache.service'
import { PolicyService } from 'src/policy/policy.service'
import { TicketsService } from 'src/tickets/tickets.service'

@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    PrismaService,
    MovieCategoriesService,
    CategoriesService,
    CacheService,
    PolicyService,
    TicketsService
  ]
})
export class MoviesModule {}
