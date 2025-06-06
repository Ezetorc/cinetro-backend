import { IsInt, IsPositive, IsString, Length } from 'class-validator'

export class CreateSeatDto {
  @IsInt()
  roomId: number

  @IsString()
  @Length(1, 1)
  row: string

  @IsInt()
  @IsPositive()
  number: number
}
