import { Injectable } from '@nestjs/common'
import { Movie, MovieCategory, Prisma } from '@prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'
import { MovieWithCategories } from 'src/movies/entities/movie-with-categories'

@Injectable()
export class MovieCategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(movieId: number, categoryName: string): Promise<MovieCategory> {
    try {
      return await this.prismaService.movieCategory.create({ data: { movieId, categoryName } })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async createMany(movieId: number, categoriesNames: string[]): Promise<MovieCategory[]> {
    return await Promise.all(
      categoriesNames.map((categoryName) => this.create(movieId, categoryName))
    )
  }

  async addToMovie(movie: Movie, categoriesNames: string[]): Promise<MovieWithCategories> {
    const movieCategories = await this.createMany(movie.id, categoriesNames)
    const categories = movieCategories.map((movieCategory) => movieCategory.categoryName)

    return { ...movie, categories }
  }

  async addToMovieWithTransaction(
    tx: Prisma.TransactionClient,
    movie: Movie,
    categories: string[]
  ) {
    const data = categories.map((category) => ({
      movieId: movie.id,
      categoryName: category
    }))

    await tx.movieCategory.createMany({ data })
  }

  async getAll(): Promise<MovieCategory[]> {
    return await this.prismaService.movieCategory.findMany()
  }

  async deleteMany(movieId: number): Promise<Prisma.BatchPayload> {
    try {
      return await this.prismaService.movieCategory.deleteMany({ where: { movieId } })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
