import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { MovieCategoriesService } from 'src/movie-categories/movie-categories.service'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { MoviePreview } from './entities/movie-preview.entity'
import { CacheService } from '../common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { MovieWithCategories } from './entities/movie-with-categories'
import { MovieWithRowCategories } from './entities/movie-with-row-categories.entity'
import { Movie } from '@prisma/client'
import { PaginateResponse } from 'src/common/types/paginate-response.type'

@Injectable()
export class MoviesService {
  constructor(
    private prismaService: PrismaService,
    private movieCategoriesService: MovieCategoriesService,
    private cacheService: CacheService
  ) {}

  async create(data: CreateMovieDto): Promise<Movie> {
    const { categories, ...rest } = data

    return await this.prismaService.$transaction(async (transaction) => {
      const newMovie = await transaction.movie.create({ data: rest })

      if (categories?.length) {
        await this.movieCategoriesService.addToMovieWithTransaction(
          transaction,
          newMovie,
          categories
        )
      }

      return newMovie
    })
  }

  async getAllForPreview(paginationDto?: PaginationDto): Promise<PaginateResponse<MoviePreview>> {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_MOVIES_PREVIEW(paginationDto),
      ttl: '1h',
      fn: () =>
        this.prismaService.paginate<MoviePreview>({
          model: 'movie',
          dto: paginationDto,
          options: { select: { title: true, id: true, thumbnail: true } }
        })
    })
  }

  async getAll(paginationDto?: PaginationDto): Promise<PaginateResponse<Movie>> {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_MOVIES(paginationDto),
      ttl: '1h',
      fn: async () => {
        const { data: movies, nextCursor } =
          await this.prismaService.paginate<MovieWithRowCategories>({
            model: 'movie',
            dto: paginationDto,
            options: {
              orderBy: { releaseDate: 'asc' },
              include: { categories: { include: { category: true } } }
            }
          })

        return {
          nextCursor,
          data: movies.map((movie) => this._getWithCategories(movie))
        }
      }
    })
  }

  async getById(id: number): Promise<MovieWithCategories> {
    return await this.cacheService.cached({
      key: CacheKeys.MOVIE(id),
      ttl: '5m',
      fn: async () => {
        const movie = await this.prismaService.movie.findUnique({
          where: { id },
          include: { categories: { include: { category: true } } }
        })

        if (movie) {
          return this._getWithCategories(movie)
        } else {
          throw new NotFoundException(`Movie with id ${id} not found`)
        }
      }
    })
  }

  async update(id: number, data: UpdateMovieDto): Promise<Movie> {
    const { categories, ...rest } = data

    return await this.prismaService.$transaction(async (tx) => {
      const updatedMovie = await tx.movie.update({ where: { id }, data: rest })

      if (categories?.length) {
        await tx.movieCategory.deleteMany({ where: { movieId: id } })
        const dataToInsert = categories.map((category) => ({ movieId: id, categoryName: category }))
        await tx.movieCategory.createMany({ data: dataToInsert })
      }

      return updatedMovie
    })
  }

  async delete(id: number): Promise<Movie> {
    try {
      const movie = this.prismaService.movie.delete({ where: { id } })
      await this.cacheService.delete(CacheKeys.MOVIE(id))

      return movie
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  private _getWithCategories(movie: MovieWithRowCategories): MovieWithCategories {
    const { categories, ...rest } = movie
    const finalCategories = categories.map((category) => category.categoryName)

    return { ...rest, categories: finalCategories } as MovieWithCategories
  }
}
