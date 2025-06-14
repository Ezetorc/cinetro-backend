import { Category } from '@prisma/client'

export class MovieWithCategories {
  id: number
  title: string
  duration: number
  thumbnail: string
  trailer: string
  classification: string
  description: string
  distributor: string
  releaseDate: Date
  categories: Array<{
    movieId: number
    categoryId: number
    category: Category
  }>
}
