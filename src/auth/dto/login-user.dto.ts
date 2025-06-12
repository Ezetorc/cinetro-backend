import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({ description: 'Your email', example: 'jhon.doe@mail.com' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Your password', example: 'myPassword123!' })
  @IsString()
  password: string
}
