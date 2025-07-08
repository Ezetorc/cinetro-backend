import { Movie } from '@prisma/client'

export type MovieWithRowCategories = Movie & {
  categories: Array<
    {
      category: {
        name: string
      }
    } & {
      movieId: number
      categoryName: string
    }
  >
}
