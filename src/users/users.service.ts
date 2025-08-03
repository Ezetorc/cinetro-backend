import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../common/services/prisma.service'
import { User } from '@prisma/client'
import { AuthService } from 'src/auth/auth.service'
import { UserWithRoles } from './entities/user-with-roles.entity'
import { UserRolesService } from 'src/user-roles/user-roles.service'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private userRolesService: UserRolesService
  ) {}

  async create(data: CreateUserDto, withRoles: 'withRoles'): Promise<UserWithRoles>
  async create(data: CreateUserDto): Promise<User>
  async create(data: CreateUserDto, withRoles?: 'withRoles'): Promise<User | UserWithRoles> {
    try {
      const hashedPassword = await this.authService.hash(data.password)
      const user = await this.prismaService.user.create({
        data: { ...data, password: hashedPassword }
      })

      if (withRoles === 'withRoles') {
        const roles = await this.userRolesService.getRolesOf(user)

        return new UserWithRoles(user, roles)
      } else {
        return user
      }
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new ConflictException('A user with that email already exists')
      }

      throw new InternalServerErrorException("Couldn't create user")
    }
  }

  async getAll(withRoles: 'withRoles'): Promise<UserWithRoles[]>
  async getAll(withRoles?: undefined): Promise<User[]>
  async getAll(withRoles?: 'withRoles'): Promise<User[] | UserWithRoles[]> {
    const users = await this.prismaService.user.findMany()

    if (withRoles === 'withRoles') {
      const allRoles = await this.userRolesService.getRolesOf(users)

      return UserWithRoles.getMany(users, allRoles)
    } else {
      return users
    }
  }

  async getById(id: number, withRoles: 'withRoles'): Promise<UserWithRoles>
  async getById(id: number, withRoles?: undefined): Promise<User | null>
  async getById(id: number, withRoles?: 'withRoles'): Promise<User | UserWithRoles> {
    const user = await this.prismaService.user.findUnique({ where: { id } })

    if (!user) throw new NotFoundException(`User with id ${id} not found`)

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

    if (!user) throw new NotFoundException(`User with email ${email} not found`)

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
  async update(id: number, data: UpdateUserDto): Promise<User>
  async update(
    id: number,
    data: UpdateUserDto,
    withRoles?: 'withRoles'
  ): Promise<User | UserWithRoles> {
    try {
      const user = await this.prismaService.user.update({ where: { id }, data })

      if (withRoles === 'withRoles') {
        const roles = await this.userRolesService.getRolesOf(user)

        return new UserWithRoles(user, roles)
      }

      return user
    } catch (error) {
      this.prismaService.throw(error)
    }
  }

  async delete(id: number, withRoles: 'withRoles'): Promise<UserWithRoles>
  async delete(id: number, withRoles?: undefined): Promise<User>
  async delete(id: number, withRoles?: 'withRoles'): Promise<User | UserWithRoles> {
    try {
      const user = await this.prismaService.user.delete({ where: { id } })

      if (withRoles === 'withRoles') {
        const roles = await this.userRolesService.getRolesOf(user)

        return new UserWithRoles(user, roles)
      }

      return user
    } catch (error) {
      this.prismaService.throw(error)
    }
  }
}
