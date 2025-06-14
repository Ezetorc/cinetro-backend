import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Genre, Role } from '@prisma/client'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'Your name',
    type: 'string',
    example: 'Jhon',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Your surname',
    type: 'string',
    example: 'Doe',
  })
  @IsString()
  surname: string

  @ApiProperty({
    description: 'Your password',
    type: 'string',
    example: 'myPassword123!',
  })
  @IsString()
  password: string

  @ApiProperty({
    description: 'Your email',
    type: 'string',
    example: 'jhon.doe@mail.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Your birth date in ISO format',
    type: 'string',
    example: '1985-08-26T00:00:00.000Z',
  })
  @IsDateString()
  birthDate: string

  @ApiProperty({
    description: 'Your phone number',
    type: 'string',
    example: '+5491123456789',
  })
  @IsPhoneNumber()
  phoneNumber: string

  @ApiPropertyOptional({
    description: 'Id of your preferred cinema',
    example: 2,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  preferredCinemaId?: number

  @ApiProperty({
    description: 'Your genre',
    example: 'FEMALE',
    enum: Genre,
  })
  @IsEnum(Genre)
  genre: Genre

  @ApiProperty({
    description: 'Your role',
    enum: Role,
    example: 'USER',
  })
  @IsEnum(Role)
  role: Role
}
