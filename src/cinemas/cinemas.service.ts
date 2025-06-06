import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCinemaDto } from './dto/create-cinema.dto'
import { UpdateCinemaDto } from './dto/update-cinema.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'

@Injectable()
export class CinemasService {
  constructor (private readonly database: PrismaService) {}

  async create (createCinemaDto: CreateCinemaDto) {
    return await this.database.cinema.create({ data: createCinemaDto })
  }

  async getAll () {
    return await this.database.cinema.findMany()
  }

  async getById (id: number) {
    return await this.database.cinema.findUnique({ where: { id } })
  }

  async update (id: number, updateCinemaDto: UpdateCinemaDto) {
    try {
      return await this.database.cinema.update({
        where: { id },
        data: updateCinemaDto,
      })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.database.cinema.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
