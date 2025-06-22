import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class CreateUserRoleDto {
  @ApiProperty({
    description: 'Id of the user',
    type: 'number',
    example: 1
  })
  @IsInt()
  userId: number

  @ApiProperty({
    description: 'Id of the role',
    type: 'number',
    example: 1
  })
  @IsInt()
  roleId: number

  @ApiProperty({
    description: 'Id of the cinema',
    type: 'number',
    example: 1
  })
  @IsInt()
  cinemaId?: number | null
}
