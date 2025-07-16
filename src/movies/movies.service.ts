import { Injectable } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { MovieCategoriesService } from 'src/movie-categories/movie-categories.service'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { MoviePreview } from './entities/movie-preview.entity'
import { CacheService } from '../common/services/cache.service'
import { CacheKeys } from 'src/common/helpers/cache-keys.helper'
import { catchTo } from 'src/common/utilities/catch-to.utility'
import { tryTo } from 'src/common/utilities/try-to.utility'
import { MovieWithCategories } from './entities/movie-with-categories'
import { MovieWithRowCategories } from './entities/movie-with-row-categories.entity'

@Injectable()
export class MoviesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly movieCategoriesService: MovieCategoriesService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateMovieDto) {
    const { categories, ...rest } = data
    const [newMovie] = await tryTo(this.prismaService.movie.create({ data: rest }))

    if (categories && newMovie) {
      return await catchTo(this.movieCategoriesService.addToMovie(newMovie, categories))
    } else {
      return newMovie
    }
  }

  async getAllForPreview(paginationDto?: PaginationDto) {
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

  async getAll(paginationDto?: PaginationDto) {
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

  async getById(id: number) {
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
          return null
        }
      }
    })
  }

  async update(id: number, data: UpdateMovieDto) {
    const { categories, ...rest } = data
    const [updatedMovie] = await tryTo(
      this.prismaService.movie.update({ where: { id }, data: rest })
    )

    if (categories && updatedMovie) {
      await this.movieCategoriesService.delete(id)

      return await catchTo(this.movieCategoriesService.addToMovie(updatedMovie, categories))
    } else {
      return updatedMovie
    }
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.movie.delete({ where: { id } }))
  }

  private _getWithCategories(movie: MovieWithRowCategories) {
    const { categories, ...rest } = movie
    const finalCategories = categories.map((category) => category.categoryName)

    return { ...rest, categories: finalCategories } as MovieWithCategories
  }
}
