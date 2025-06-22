import {
  IsEnum,
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator'
import { Classification } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateMovieDto {
  @ApiProperty({
    description: 'Name of the movie',
    example: 'The adventure of Lalo',
  })
  @IsString()
  title: string

  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: 120,
  })
  @IsInt()
  duration: number

  @ApiPropertyOptional({
    description: 'Link of the movie thumbnail',
    example: 'https://any.site.com/the-adventure-of-lalo-thumbnail',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string

  @ApiPropertyOptional({
    description: 'Link of the movie trailer',
    example: 'https://www.youtube.com/123456',
  })
  @IsOptional()
  @IsString()
  trailer?: string

  @ApiProperty({
    description: 'Age classification of the movie',
    enum: Classification,
    example: 'SIXTEEN',
  })
  @IsEnum(Classification)
  classification: Classification

  @ApiProperty({
    description: 'ApiDescription of the movie',
    example:
      'A brave young llama named Lalo embarks on a thrilling journey across the Andes to save his village from an ancient curse.',
  })
  @IsString()
  description: string

  @ApiProperty({
    description: 'Distributor of the movie',
    example: 'Lalo Productions',
  })
  @IsString()
  distributor: string

  @ApiProperty({
    description: 'Release date of the movie in ISO format',
    example: '2001-01-01T00:00:00.000Z',
  })
  @IsDateString()
  releaseDate: string

  @ApiPropertyOptional({
    description:
      "IDs of the categories of the movies. See them in the 'categories' resource",
    example: [1, 2],
  })
  @IsNumber({}, { each: true })
  categoriesIds?: number[]
}
