import { Controller, Post, Body, Patch } from '@nestjs/common'
import { UserRolesService } from './user-roles.service'
import { CreateUserRoleDto } from './dto/create-user-role.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  @UsePolicy('create', 'user-role')
  create(@Body() createDto: CreateUserRoleDto) {
    return this.userRolesService.create(createDto)
  }

  @Patch()
  @UsePolicy('update', 'user-role')
  update(@Body() updateDto: UpdateUserRoleDto) {
    return this.userRolesService.update(updateDto)
  }
}
