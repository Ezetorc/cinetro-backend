import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString, Length } from 'class-validator'

export class CreateSeatDto {
  @ApiProperty({
    description: 'Id of the room',
    type: 'number',
    example: 1,
  })
  @IsInt()
  roomId: number

  @ApiProperty({
    description: 'Name of the row',
    type: 'string',
    example: 'A',
  })
  @IsString()
  @Length(1, 1)
  row: string

  @ApiProperty({
    description: 'Number of the seat in the row',
    type: 'number',
    example: 12,
  })
  @IsInt()
  @IsPositive()
  number: number
}
