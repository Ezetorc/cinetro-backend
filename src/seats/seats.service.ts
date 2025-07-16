import { Injectable } from '@nestjs/common'
import { CreateSeatDto } from './dto/create-seat.dto'
import { UpdateSeatDto } from './dto/update-seat.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { PaginationDto } from '../common/dto/pagination-args.dto'
import { Seat } from '@prisma/client'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class SeatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateSeatDto) {
    return await catchTo(this.prismaService.seat.create({ data }))
  }

  async getAll(paginationDto: PaginationDto) {
    return await this.prismaService.paginate<Seat>({ model: 'seat', dto: paginationDto })
  }

  async getById(id: number) {
    return await this.prismaService.seat.findUnique({ where: { id } })
  }

  async update(id: number, data: UpdateSeatDto) {
    return await catchTo(this.prismaService.seat.update({ where: { id }, data }))
  }

  async delete(id: number) {
    return await catchTo(this.prismaService.seat.delete({ where: { id } }))
  }
}
