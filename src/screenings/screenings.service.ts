import { Injectable } from '@nestjs/common'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { PrismaService } from '../common/services/prisma.service'
import { PaginationArgs } from '../common/dto/pagination-args.dto'
import { Screening } from '@prisma/client'

@Injectable()
export class ScreeningsService {
  constructor (private readonly prismaService: PrismaService) {}

  async create (data: CreateScreeningDto) {
    try {
      return await this.prismaService.screening.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getAll (paginationArgs: PaginationArgs) {
    return await this.prismaService.paginate<Screening>({
      model: 'screening',
      paginationArgs,
    })
  }

  async getById (id: number) {
    return await this.prismaService.screening.findUnique({ where: { id } })
  }

  async update (id: number, data: UpdateScreeningDto) {
    try {
      return await this.prismaService.screening.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.prismaService.screening.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
