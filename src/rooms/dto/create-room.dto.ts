import { IsInt, IsString } from 'class-validator'

export class CreateRoomDto {
  @IsInt()
  cinemaId: number

  @IsInt()
  seatRows: number

  @IsInt()
  seatColumns: number

  @IsString()
  name: string
}
