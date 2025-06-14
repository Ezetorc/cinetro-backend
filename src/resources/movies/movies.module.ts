import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { PrismaService } from 'src/resources/common/services/prisma.service'
import { MovieCategoriesService } from 'src/resources/movie-categories/movie-categories.service'
import { CategoriesService } from 'src/resources/categories/categories.service'
import { CacheService } from '../common/services/cache.service'

@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    PrismaService,
    MovieCategoriesService,
    CategoriesService,
    CacheService,
  ],
})
export class MoviesModule {}
