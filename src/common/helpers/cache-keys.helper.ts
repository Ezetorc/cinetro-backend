import { PaginationDto } from '../dto/pagination-args.dto'

export class CacheKeys {
  private static _getWithPagination(name: string, paginationDto?: PaginationDto) {
    return `${name}:${paginationDto?.cursor ?? 'start'}`
  }

  private static _getWithId(name: string, id: number) {
    return `${name}:${id}`
  }

  static PAGINATED_MOVIES_PREVIEW(paginationDto?: PaginationDto) {
    return this._getWithPagination('movies-preview', paginationDto)
  }

  static PAGINATED_MOVIES(paginationDto?: PaginationDto) {
    return this._getWithPagination('movies', paginationDto)
  }

  static MOVIE(id: number) {
    return this._getWithId('movie', id)
  }

  static PAGINATED_CINEMAS(paginationDto?: PaginationDto) {
    return this._getWithPagination('cinemas', paginationDto)
  }

  static CINEMA(id: number) {
    return this._getWithId('cinema', id)
  }

  static PAGINATED_SCREENINGS(paginationDto?: PaginationDto) {
    return this._getWithPagination('screenings', paginationDto)
  }

  static SCREENING(id: number) {
    return this._getWithId('screening', id)
  }

  static PAGINATED_ROOMS(paginationDto?: PaginationDto) {
    return this._getWithPagination('rooms', paginationDto)
  }

  static PAGINATED_CATEGORIES(paginationDto?: PaginationDto) {
    return this._getWithPagination('categories', paginationDto)
  }
}
