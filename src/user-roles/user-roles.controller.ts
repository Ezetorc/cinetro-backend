import { Controller, Post, Body, Patch, Delete } from '@nestjs/common'
import { UserRolesService } from './user-roles.service'
import { CreateUserRoleDto } from './dto/create-user-role.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'
import { DeleteUserRoleDto } from './dto/delete-user-role.dto'

@Controller('user-roles')
export class UserRolesController {
  constructor(private userRolesService: UserRolesService) {}

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

  @Delete('/:id')
  @UsePolicy('delete', 'user-role')
  delete(@Body() deleteDto: DeleteUserRoleDto) {
    return this.userRolesService.delete(deleteDto)
  }
}
