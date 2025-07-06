import { ApiProperty } from '@nestjs/swagger'
import { Format } from '@prisma/client'
import { IsDateString, IsEnum, IsInt } from 'class-validator'

export class CreateScreeningDto {
  @ApiProperty({
    description: 'Id of the movie',
    example: 1
  })
  @IsInt()
  movieId: number

  @ApiProperty({
    description: 'Id of the room',
    example: 2
  })
  @IsInt()
  roomId: number

  @ApiProperty({
    description: 'Start date of the movie in ISO format',
    example: '2001-01-02T18:00:00.000Z'
  })
  @IsDateString()
  startTime: string

  @ApiProperty({
    description: 'Format of the movie',
    enum: Format,
    example: 'TWO_D'
  })
  @IsEnum(Format)
  format: Format
}
