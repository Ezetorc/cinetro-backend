import { Injectable } from '@nestjs/common'
import { CreateUserRoleDto } from './dto/create-user-role.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { RoleName } from 'src/common/enums/role-name.enum'
import { User } from '@prisma/client'
import { Roles } from 'src/common/types/roles.type'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { catchTo } from 'src/common/utilities/catch-to.utility'

@Injectable()
export class UserRolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserRoleDto) {
    return await catchTo(this.prismaService.userRole.create({ data }))
  }

  async update(data: UpdateUserRoleDto) {
    return await catchTo(
      this.prismaService.userRole.update({
        where: { userId_roleName: { userId: data.userId, roleName: data.roleName } },
        data
      })
    )
  }

  async getRolesOf(user: User): Promise<Roles>
  async getRolesOf(users: User[]): Promise<Roles[]>
  async getRolesOf(userOrUsers: User | User[]): Promise<Roles | Roles[]> {
    const isArray = Array.isArray(userOrUsers)

    if (isArray) {
      return await this._getRolesOfMultiple(userOrUsers)
    } else {
      return await this._getRolesOfSingular(userOrUsers)
    }
  }

  private async _getRolesOfSingular(user: User) {
    const userRoles = await this.prismaService.userRole.findMany({
      where: { userId: user.id },
      include: { role: { select: { name: true } } }
    })

    return userRoles.map((userRole) => ({
      name: userRole.role.name as RoleName,
      cinemaId: userRole.cinemaId
    }))
  }

  private async _getRolesOfMultiple(users: User[]) {
    return await Promise.all(users.map((user) => this._getRolesOfSingular(user)))
  }
}
