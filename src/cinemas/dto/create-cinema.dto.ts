import { ApiProperty } from '@nestjs/swagger'
import { IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator'

export class CreateCinemaDto {
  @ApiProperty({ description: 'Name of the cinema' })
  @IsString()
  name: string

  @ApiProperty({ description: 'Location adress of the cinema' })
  @IsString()
  location: string

  @ApiProperty({ description: 'Latitude of the cinema' })
  @IsLatitude()
  @IsNumber()
  latitude: number

  @ApiProperty({ description: 'longitude of the cinema' })
  @IsLongitude()
  @IsNumber()
  longitude: number
}
