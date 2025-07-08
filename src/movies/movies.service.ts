import { Injectable } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { MovieCategoriesService } from 'src/movie-categories/movie-categories.service'
import { PaginationArgs } from 'src/common/dto/pagination-args.dto'
import { MoviePreview } from './entities/movie-preview.entity'
import { MovieWithCategories } from './entities/movie-with-categories'
import { CacheService } from '../common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { handle } from 'src/common/utilities/handle.utility'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class MoviesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly movieCategoriesService: MovieCategoriesService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateMovieDto) {
    try {
      const { categories, ...rest } = data
      const newMovie = await this.prismaService.movie.create({ data: rest })

      if (categories) {
        return await this.movieCategoriesService.addToMovie(newMovie, categories)
      } else {
        return newMovie
      }
    } catch (error) {
      handle(error)
    }
  }

  async getAllForPreview(paginationArgs?: PaginationArgs) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_MOVIES_PREVIEW(paginationArgs),
      ttl: '1h',
      fn: () =>
        this.prismaService.paginate<MoviePreview>({
          model: 'movie',
          paginationArgs,
          options: {
            select: {
              title: true,
              id: true,
              thumbnail: true
            }
          }
        })
    })
  }

  async getAll(paginationArgs?: PaginationArgs) {
    return await this.cacheService.cached({
      key: CacheKeys.PAGINATED_MOVIES(paginationArgs),
      ttl: '1h',
      fn: async () => {
        const { data, nextCursor } = await this.prismaService.paginate<MovieWithCategories>({
          model: 'movie',
          paginationArgs,
          options: {
            orderBy: { releaseDate: 'asc' },
            include: {
              categories: {
                include: {
                  category: true
                }
              }
            }
          }
        })

        return {
          data: data.map((movie) => ({
            ...movie,
            categories: movie.categories.map((c) => c.category.name)
          })),
          nextCursor
        }
      }
    })
  }

  async getById(id: number) {
    return await this.cacheService.cached({
      key: CacheKeys.MOVIE(id),
      ttl: '5m',
      fn: async () => {
        const movie = await this.prismaService.movie.findUnique({
          where: { id },
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        })

        if (movie) {
          return {
            ...movie,
            categories: movie.categories.map((mc) => mc.category.name)
          }
        } else {
          return null
        }
      }
    })
  }

  async update(id: number, data: UpdateMovieDto) {
    try {
      const { categories, ...rest } = data
      const updatedMovie = await this.prismaService.movie.update({ where: { id }, data: rest })

      if (categories) {
        await this.movieCategoriesService.delete(id)

        return await this.movieCategoriesService.addToMovie(updatedMovie, categories)
      } else {
        return updatedMovie
      }
    } catch (error) {
      handle(error)
    }
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.movie.delete({ where: { id } }))
  }
}
