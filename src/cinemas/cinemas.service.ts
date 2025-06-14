import { Injectable } from '@nestjs/common'
import { CreateCinemaDto } from './dto/create-cinema.dto'
import { UpdateCinemaDto } from './dto/update-cinema.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { Cinema } from '@prisma/client'
import { PaginationArgs } from '../common/dto/pagination-args.dto'

@Injectable()
export class CinemasService {
  constructor (private readonly prismaService: PrismaService) {}

  async create (data: CreateCinemaDto) {
    return await this.prismaService.cinema.create({ data })
  }

  async getAll (paginationArgs: PaginationArgs) {
    return await this.prismaService.paginate<Cinema>({
      model: 'cinema',
      paginationArgs: paginationArgs,
    })
  }

  async getById (id: number) {
    return await this.prismaService.cinema.findUnique({ where: { id } })
  }

  async update (id: number, data: UpdateCinemaDto) {
    try {
      return await this.prismaService.cinema.update({ where: { id }, data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async delete (id: number) {
    try {
      return await this.prismaService.cinema.delete({ where: { id } })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }
}
