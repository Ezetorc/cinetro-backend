import { ModelMap } from './model-map.type'

export type PaginateResponse<T = undefined> = {
  data: T extends undefined ? ModelMap[keyof ModelMap][] : T[]
  nextCursor: string | null
}
