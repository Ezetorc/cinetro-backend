import { Genre } from '@prisma/client'
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
  @IsString()
  name: string

  @IsString()
  surname: string

  @IsString()
  password: string

  @IsEmail()
  email: string

  @IsDateString()
  birthDate: string

  @IsPhoneNumber()
  phoneNumber: string

  @IsOptional()
  @IsNumber()
  preferredCinemaId?: number

  @IsEnum(Genre)
  genre: Genre

  @IsDateString()
  createdAt: string
}
