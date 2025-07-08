import { Injectable } from '@nestjs/common'
import { Movie } from '@prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class MovieCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(movieId: number, categoryName: string) {
    return await catchTo(
      this.prismaService.movieCategory.create({ data: { movieId, categoryName } })
    )
  }

  async createMany(movieId: number, categoriesNames: string[]) {
    return await Promise.all(
      categoriesNames.map((categoryName) => this.create(movieId, categoryName))
    )
  }

  async addToMovie(movie: Movie, categoriesNames: string[]) {
    const movieCategories = await this.createMany(movie.id, categoriesNames)
    const categories = movieCategories.map((movieCategory) => movieCategory.categoryName as string)

    return { ...movie, categories }
  }

  async getAll() {
    return await catchTo(this.prismaService.movieCategory.findMany())
  }

  async delete(movieId: number) {
    return await catchTo(this.prismaService.movieCategory.deleteMany({ where: { movieId } }))
  }
}
