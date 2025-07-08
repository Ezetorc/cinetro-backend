import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../common/services/prisma.service'
import { User } from '@prisma/client'
import { AuthService } from 'src/auth/auth.service'
import { UserWithRoles } from './entities/user-with-roles.entity'
import { UserRolesService } from 'src/user-roles/user-roles.service'
import { handle } from 'src/common/utilities/handle.utility'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userRolesService: UserRolesService
  ) {}

  async create(data: CreateUserDto, withRoles: 'withRoles'): Promise<UserWithRoles>
  async create(data: CreateUserDto, withRoles?: undefined): Promise<User>
  async create(
    data: CreateUserDto,
    withRoles?: 'withRoles'
  ): Promise<User | UserWithRoles | undefined> {
    const hashedPassword = await this.authService.hash(data.password)

    try {
      const user = await this.prismaService.user.create({
        data: {
          ...data,
          password: hashedPassword
        }
      })

      if (withRoles === 'withRoles') {
        const roles = await this.userRolesService.getRolesOf(user)
        return new UserWithRoles(user, roles)
      } else {
        return user
      }
    } catch (error) {
      handle(error)
    }
  }

  async getAll(withRoles: 'withRoles'): Promise<UserWithRoles[]>
  async getAll(withRoles?: undefined): Promise<User[]>
  async getAll(withRoles?: 'withRoles'): Promise<User[] | UserWithRoles[]> {
    const users = await this.prismaService.user.findMany()

    if (withRoles === 'withRoles') {
      const allRoles = await Promise.all(
        users.map((user) => this.userRolesService.getRolesOf(user))
      )
      return UserWithRoles.getMany(users, allRoles)
    } else {
      return users
    }
  }

  async getById(id: number, withRoles: 'withRoles'): Promise<UserWithRoles | null>
  async getById(id: number, withRoles?: undefined): Promise<User | null>
  async getById(id: number, withRoles?: 'withRoles'): Promise<User | UserWithRoles | null> {
    const user = await this.prismaService.user.findUnique({ where: { id } })

    if (!user) return null

    if (withRoles === 'withRoles') {
      const roles = await this.userRolesService.getRolesOf(user)
      return new UserWithRoles(user, roles)
    } else {
      return user
    }
  }

  async getByEmail(email: string, withRoles: 'withRoles'): Promise<UserWithRoles | null>
  async getByEmail(email: string, withRoles?: undefined): Promise<User | null>
  async getByEmail(email: string, withRoles?: 'withRoles'): Promise<User | UserWithRoles | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) return null

    if (withRoles === 'withRoles') {
      const roles = await this.userRolesService.getRolesOf(user)
      return new UserWithRoles(user, roles)
    } else {
      return user
    }
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.prismaService.user.count({ where: { email } })
    return Boolean(count)
  }

  async update(id: number, data: UpdateUserDto, withRoles: 'withRoles'): Promise<UserWithRoles>
  async update(id: number, data: UpdateUserDto, withRoles?: undefined): Promise<User>
  async update(
    id: number,
    data: UpdateUserDto,
    withRoles?: 'withRoles'
  ): Promise<User | UserWithRoles | undefined> {
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data
      })

      if (withRoles === 'withRoles') {
        const roles = await this.userRolesService.getRolesOf(user)
        return new UserWithRoles(user, roles)
      } else {
        return user
      }
    } catch (error) {
      handle(error)
    }
  }

  async delete(id: number, withRoles: 'withRoles'): Promise<UserWithRoles>
  async delete(id: number, withRoles?: undefined): Promise<User>
  async delete(id: number, withRoles?: 'withRoles'): Promise<User | UserWithRoles | undefined> {
    try {
      const user = await this.prismaService.user.delete({ where: { id } })

      if (withRoles === 'withRoles') {
        const roles = await this.userRolesService.getRolesOf(user)
        return new UserWithRoles(user, roles)
      } else {
        return user
      }
    } catch (error) {
      handle(error)
    }
  }
}
