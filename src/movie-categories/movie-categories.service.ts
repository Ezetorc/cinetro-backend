import { Injectable } from '@nestjs/common'
import { Movie } from '@prisma/client'
import { CategoriesService } from 'src/categories/categories.service'
import { PrismaService } from 'src/common/services/prisma.service'

@Injectable()
export class MovieCategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoriesService: CategoriesService
  ) {}

  async getAll() {
    return await this.prismaService.movieCategory.findMany()
  }

  async addCategoriesToMovie(movie: Movie, categoriesIds?: number[]) {
    if (!categoriesIds) return movie

    const hasCategories = categoriesIds?.length ? categoriesIds?.length > 0 : false

    if (hasCategories) {
      await this.create(movie.id, categoriesIds)

      const categoriesNames = await this.categoriesService.getNamesByIds(categoriesIds)

      movie['categories'] = categoriesNames
    }

    return movie
  }

  async delete(movieId: number) {
    return await this.prismaService.movieCategory.deleteMany({
      where: { movieId }
    })
  }

  async create(movieId: number, categoriesIds: number[]) {
    await Promise.all(
      categoriesIds.map((categoryId) =>
        this.prismaService.movieCategory.upsert({
          where: { movieId_categoryId: { movieId, categoryId } },
          update: {},
          create: { movieId, categoryId }
        })
      )
    )
  }
}
