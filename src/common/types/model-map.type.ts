import { PrismaClient } from '@prisma/client'

export type ModelMap = {
  movie: PrismaClient['movie']
  user: PrismaClient['user']
  cinema: PrismaClient['cinema']
  room: PrismaClient['room']
  screening: PrismaClient['screening']
  seat: PrismaClient['seat']
  category: PrismaClient['category']
}
