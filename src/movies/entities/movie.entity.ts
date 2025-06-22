import { Classification, Movie } from '@prisma/client'

export class MovieEntity implements Movie {
  id: number
  title: string
  duration: number
  thumbnail: string | null
  trailer: string | null
  classification: Classification
  description: string
  distributor: string
  releaseDate: Date

  constructor (movie: Movie) {
    Object.assign(this, movie)
  }
}
