import { Movie } from '@prisma/client'

export type MovieWithCategories = Movie & { categories: string[] }
