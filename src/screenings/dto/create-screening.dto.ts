import { Format } from '@prisma/client'
import { IsDateString, IsEnum, IsInt } from 'class-validator'

export class CreateScreeningDto {
  @IsInt()
  movieId: number

  @IsInt()
  roomId: number

  @IsDateString()
  startTime: string

  @IsEnum(Format)
  format: Format
}
