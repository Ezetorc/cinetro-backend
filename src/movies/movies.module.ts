import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { PrismaService } from 'src/common/services/prisma.service'
import { MovieCategoriesService } from 'src/movie-categories/movie-categories.service'
import { CategoriesService } from 'src/categories/categories.service'

@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    PrismaService,
    MovieCategoriesService,
    CategoriesService,
  ],
})
export class MoviesModule {}
