import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import * as ms from 'ms'
import { StringValue } from 'ms'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cached<T = any>(params: {
    key: string
    fn: () => Promise<T>
    ttl?: StringValue
  }): Promise<T> {
    const cachedData = await this.get<T>(params.key)
    const ttl = params.ttl ? ms(params.ttl) : 5 * 60 * 1000

    if (cachedData !== undefined && cachedData !== null) {
      return cachedData
    }

    const data = await params.fn()
    await this.set(params.key, data, ttl)

    return data
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key)
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl)
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear()
  }
}
