import { Module } from '@nestjs/common'
import { MovieCategoriesService } from './movie-categories.service'
import { PrismaService } from 'src/common/services/prisma.service'

@Module({
  providers: [MovieCategoriesService, PrismaService],
  exports: [MovieCategoriesService]
})
export class MovieCategoriesModule {}
