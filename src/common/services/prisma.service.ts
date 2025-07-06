import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PaginateParams } from '../types/paginate-params.type'
import { ModelMap } from '../types/model-map.type'
import { PaginateResponse } from '../types/paginate-response.type'
import { ModelDelegate } from '../types/model-delegate.type'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect()
    } catch (err) {
      console.error('DB connection failed, retrying...', err)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async paginate<T = undefined>(
    params: PaginateParams<keyof ModelMap>
  ): Promise<PaginateResponse<T>> {
    const { model: modelName, paginationArgs } = params
    const { cursor = undefined, limit = 8 } = paginationArgs || {}
    const model = this[modelName] as ModelDelegate

    const data = await model.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: { id: Number(cursor) }
      }),
      ...params.options
    })

    const nextCursor = data.length > 0 ? data[data.length - 1].id : null

    return { data, nextCursor }
  }
}
