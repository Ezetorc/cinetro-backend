import { Injectable } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { Category } from '@prisma/client'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'
import { MovieCategoriesService } from 'src/movie-categories/movie-categories.service'
import { CategoriesService } from 'src/categories/categories.service'

@Injectable()
export class MoviesService {
  constructor (
    private readonly database: PrismaService,
    private readonly movieCategoriesService: MovieCategoriesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getAllMovies (forPreview?: boolean) {
    if (forPreview) {
      return await this.database.movie.findMany({
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      })
    }

    const movies = await this.database.movie.findMany({
      select: {
        id: true,
        title: true,
        duration: true,
        thumbnail: true,
        trailer: true,
        classification: true,
        description: true,
        distributor: true,
        releaseDate: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    return movies.map(movie => ({
      ...movie,
      categories: movie.categories.map(mc => mc.category.name),
    }))
  }

  async getMovieById (id: number) {
    const movie = await this.database.movie.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (movie) {
      return {
        ...movie,
        categories: movie.categories.map(mc => mc.category.name),
      }
    } else {
      return null
    }
  }

  async createMovie (createMovieDto: CreateMovieDto) {
    const { categoriesIds, ...data } = createMovieDto
    const newMovie = await this.database.movie.create({ data })
    const updatedMovie = await this.movieCategoriesService.addCategoriesToMovie(
      newMovie,
      categoriesIds,
    )

    return updatedMovie
  }

  async updateMovie (id: number, updateMovieDto: UpdateMovieDto) {
    const { categoriesIds, ...data } = updateMovieDto

    try {
      const updatedMovie = await this.database.movie.update({
        where: { id },
        data,
      })

      if (categoriesIds) {
        await this.movieCategoriesService.deleteMovieCategories(id)
        await this.movieCategoriesService.createMovieCategories(
          id,
          categoriesIds,
        )

        const categoriesNames =
          await this.categoriesService.getNamesByIds(categoriesIds)

        updatedMovie['categories'] = categoriesNames
      }

      return updatedMovie
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Movie with id ${id} not found`)
    }
  }

  async deleteMovie (id: number) {
    try {
      return await this.database.movie.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Movie with id ${id} not found`)
    }
  }
}
