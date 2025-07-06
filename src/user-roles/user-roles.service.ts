import { Injectable } from '@nestjs/common'
import { CreateUserRoleDto } from './dto/create-user-role.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { RoleName } from 'src/common/enums/role-name.enum'
import { User } from '@prisma/client'
import { Roles } from 'src/common/types/roles.type'
import { ErrorHandler } from 'src/common/helpers/error-handler.helper'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'

@Injectable()
export class UserRolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserRoleDto) {
    try {
      return await this.prismaService.userRole.create({ data })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async update(data: UpdateUserRoleDto) {
    try {
      return await this.prismaService.userRole.update({
        where: {
          userId_roleName: {
            userId: data.userId,
            roleName: data.roleName
          }
        },
        data
      })
    } catch (error) {
      ErrorHandler.handle(error)
    }
  }

  async getRolesOf(user: User): Promise<Roles> {
    const userRoles = await this.prismaService.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: {
          select: {
            name: true
          }
        }
      }
    })

    return userRoles.map((userRole) => ({
      name: userRole.role.name as RoleName,
      cinemaId: userRole.cinemaId
    }))
  }
}
