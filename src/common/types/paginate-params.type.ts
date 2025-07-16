import { PrismaClient } from '@prisma/client'
import { PaginationDto } from '../dto/pagination-args.dto'
import { ModelMap } from './model-map.type'

export type PaginateParams = {
  model: keyof ModelMap
  dto?: PaginationDto
  options?: Omit<
    Parameters<
      PrismaClient[keyof ModelMap] extends { findMany(args: any): any }
        ? PrismaClient[keyof ModelMap]['findMany']
        : never
    >[0],
    'take' | 'skip' | 'cursor'
  >
}
