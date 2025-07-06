import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { RoleName } from 'src/common/enums/role-name.enum'

export class CreateUserRoleDto {
  @ApiProperty({
    description: 'Id of the user',
    type: 'number',
    example: 1
  })
  @IsInt()
  userId: number

  @ApiProperty({
    description: 'Name of the role',
    enum: RoleName,
    example: RoleName.MANAGER
  })
  @IsInt()
  roleName: RoleName

  @ApiProperty({
    description: 'Id of the cinema',
    type: 'number',
    example: 1
  })
  @IsInt()
  cinemaId?: number | null
}
