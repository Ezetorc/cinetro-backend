import { PaginationArgs } from '../dto/pagination-args.dto'

export const CacheKeys = {
  PAGINATED_MOVIES_PREVIEW: (paginationArgs?: PaginationArgs) =>
    `movies-preview:all:${paginationArgs?.cursor ?? 'start'}`,
  PAGINATED_MOVIES: (paginationArgs?: PaginationArgs) =>
    `movies:all:${paginationArgs?.cursor ?? 'start'}`,
  MOVIE: (id: number) => `movie:${id}`,
}
