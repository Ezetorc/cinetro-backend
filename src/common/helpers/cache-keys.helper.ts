import { PaginationArgs } from '../dto/pagination-args.dto'

export class CacheKeys {
  private static _getWithPagination (
    name: string,
    paginationArgs?: PaginationArgs
  ) {
    return `${name}:${paginationArgs?.cursor ?? 'start'}`
  }

  private static _getWithId (name: string, id: number) {
    return `${name}:${id}`
  }

  static PAGINATED_MOVIES_PREVIEW (paginationArgs?: PaginationArgs) {
    return this._getWithPagination('movies-preview', paginationArgs)
  }

  static PAGINATED_MOVIES (paginationArgs?: PaginationArgs) {
    return this._getWithPagination('movies', paginationArgs)
  }

  static MOVIE (id: number) {
    return this._getWithId('movie', id)
  }

  static PAGINATED_CINEMAS (paginationArgs?: PaginationArgs) {
    return this._getWithPagination('cinemas', paginationArgs)
  }

  static CINEMA (id: number) {
    return this._getWithId('cinema', id)
  }

  static PAGINATED_SCREENINGS (paginationArgs?: PaginationArgs) {
    return this._getWithPagination('screenings', paginationArgs)
  }

  static SCREENING (id: number) {
    return this._getWithId('screening', id)
  }
}
