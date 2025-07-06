import { PrismaClient } from '@prisma/client'
import { PaginationArgs } from '../dto/pagination-args.dto'
import { ModelMap } from './model-map.type'

export type PaginateParams<K extends keyof ModelMap> = {
  model: K
  paginationArgs?: PaginationArgs
  options?: Omit<
    Parameters<
      PrismaClient[K] extends { findMany(args: any): any } ? PrismaClient[K]['findMany'] : never
    >[0],
    'take' | 'skip' | 'cursor'
  >
}
