import { RoleName } from './../common/enums/role-name.enum'
import { Injectable } from '@nestjs/common'
import { CreateUserRoleDto } from './dto/create-user-role.dto'
import { PrismaService } from 'src/common/services/prisma.service'
import { User, UserRole } from '@prisma/client'
import { Roles } from 'src/common/types/roles.type'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { DeleteUserRoleDto } from './dto/delete-user-role.dto'
import { UserWithRoles } from 'src/users/entities/user-with-roles.entity'

@Injectable()
export class UserRolesService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserRoleDto): Promise<UserRole> {
    try {
      return await this.prismaService.userRole.create({ data })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async update(data: UpdateUserRoleDto): Promise<UserRole> {
    try {
      return this.prismaService.userRole.update({
        where: { userId_roleName: { userId: data.userId, roleName: data.roleName } },
        data
      })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(data: DeleteUserRoleDto): Promise<UserRole> {
    try {
      return this.prismaService.userRole.delete({
        where: { userId_roleName: { userId: data.userId, roleName: data.roleName } }
      })
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async createUserRolesOf(user: UserWithRoles): Promise<void> {
    for (const role of user.roles) {
      await this.create({
        cinemaId: role.cinemaId,
        roleName: role.name,
        userId: user.id
      })
    }
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
