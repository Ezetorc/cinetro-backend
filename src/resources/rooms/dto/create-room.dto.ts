import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString } from 'class-validator'

export class CreateRoomDto {
  @ApiProperty({
    description: 'ID of the cinema this room belongs to',
    example: 1,
  })
  @IsInt()
  cinemaId: number

  @ApiProperty({ description: 'Number of seat rows in the room', example: 10 })
  @IsInt()
  seatRows: number

  @ApiProperty({
    description: 'Number of seat columns in the room',
    example: 15,
  })
  @IsInt()
  seatColumns: number

  @ApiProperty({ description: 'Name of the room', example: 'Room A' })
  @IsString()
  name: string
}
