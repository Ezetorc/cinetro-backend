import { Injectable } from '@nestjs/common'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/classes/ErrorHandler'

@Injectable()
export class ScreeningsService {
  constructor (private readonly database: PrismaService) {}

  async createScreening (createScreeningDto: CreateScreeningDto) {
    try {
      return await this.database.screening.create({ data: createScreeningDto })
    } catch (error) {
      ErrorHandler.handleNotFound(
        error,
        `Movie with id ${createScreeningDto.movieId} or room with id ${createScreeningDto.roomId} not found`,
      )
    }
  }

  async getAllScreenings () {
    return await this.database.screening.findMany()
  }

  async getScreeningById (id: number) {
    return await this.database.screening.findUnique({ where: { id } })
  }

  async updateScreening (id: number, updateScreeningDto: UpdateScreeningDto) {
    try {
      return await this.database.screening.update({
        where: { id },
        data: updateScreeningDto,
      })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Screening with id ${id} not found`)
    }
  }

  async deleteScreening (id: number) {
    try {
      return await this.database.screening.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handleNotFound(error, `Screening with id ${id} not found`)
    }
  }
}
