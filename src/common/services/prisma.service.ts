import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PaginateParams } from '../types/paginate-params.type'
import { ModelMap } from '../types/model-map.type'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit () {
    await this.$connect()
  }

  async onModuleDestroy () {
    await this.$disconnect()
  }

  async paginate<T = undefined> (
    params: PaginateParams<keyof ModelMap>,
  ): Promise<{
    data: T extends undefined ? ModelMap[keyof ModelMap][] : T[]
    nextCursor: string | null
  }> {
    const { model, paginationArgs } = params
    const { cursor, limit = 8 } = paginationArgs || {}
    const modelClient = this[model] as any

    const data = await modelClient.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: { id: Number(cursor) },
      }),
      ...params.options,
    })

    const nextCursor = data.length > 0 ? data[data.length - 1].id : null

    return { data, nextCursor }
  }
}
