import { Injectable } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PrismaService } from 'src/resources/common/services/prisma.service'
import { ErrorHandler } from 'src/resources/common/helpers/error-handler.helper'
import { MovieCategoriesService } from 'src/resources/movie-categories/movie-categories.service'
import { CategoriesService } from 'src/resources/categories/categories.service'
import { PaginationArgs } from 'src/resources/common/dto/pagination-args.dto'
import { MoviePreview } from './entities/movie-preview.entity'
import { Movie } from '@prisma/client'

@Injectable()
export class MoviesService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly movieCategoriesService: MovieCategoriesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create (data: CreateMovieDto) {
    const { categoriesIds, ...rest } = data
    const newMovie = await this.prismaService.movie.create({ data: rest })
    const updatedMovie = await this.movieCategoriesService.addCategoriesToMovie(
      newMovie,
      categoriesIds,
    )

    return updatedMovie
  }

  async getAllForPreview (paginationArgs?: PaginationArgs) {
    return await this.prismaService.paginate<Movie>({
      model: 'movie',
      paginationArgs,
      options: {
        select: {
          title: true,
          id: true,
          thumbnail: true,
        },
      },
    })
  }

  async getAll (paginationArgs?: PaginationArgs) {
    const { data, nextCursor } =
      await this.prismaService.paginate<MoviePreview>({
        model: 'movie',
        paginationArgs,
        options: {
          orderBy: { releaseDate: 'asc' },
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      })

    return {
      data: data.map(movie => ({
        ...movie,
        categories: movie.categories.map(category => category.category.name),
      })),
      nextCursor,
    }
  }

  async getById (id: number) {
    const movie = await this.prismaService.movie.findUnique({
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

  async update (id: number, data: UpdateMovieDto) {
    const { categoriesIds, ...rest } = data

    try {
      const updatedMovie = await this.prismaService.movie.update({
        where: { id },
        data: rest,
      })

      if (categoriesIds) {
        await this.movieCategoriesService.delete(id)
        await this.movieCategoriesService.create(id, categoriesIds)

        const categoriesNames = await this.categoriesService.getNamesByIds(
          categoriesIds,
        )

        updatedMovie['categories'] = categoriesNames
      }

      return updatedMovie
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.prismaService.movie.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
