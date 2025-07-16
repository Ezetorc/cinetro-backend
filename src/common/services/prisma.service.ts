import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PaginateParams } from '../types/paginate-params.type'
import { PaginateResponse } from '../types/paginate-response.type'
import { ModelDelegate } from '../types/model-delegate.type'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect()
    } catch (error) {
      console.error('DB connection failed, retrying...', error)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async paginate<T = undefined>(params: PaginateParams): Promise<PaginateResponse<T>> {
    const { model: modelName, dto } = params
    const { cursor = undefined, limit = 8 } = dto || {}
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
