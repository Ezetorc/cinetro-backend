import { ApiProperty } from '@nestjs/swagger'
import { IsLatitude, IsLongitude, IsString } from 'class-validator'

export class CreateCinemaDto {
  @ApiProperty({
    description: 'Name of the cinema',
    example: 'San Justo Cinemax',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Location address of the cinema',
    example: 'Buenos Aires, San Justo, Bruselas 1234',
  })
  @IsString()
  location: string

  @ApiProperty({ description: 'Latitude of the cinema', example: -34.6825 })
  @IsLatitude()
  latitude: number

  @ApiProperty({ description: 'Longitude of the cinema', example: -58.5606 })
  @IsLongitude()
  longitude: number
}
