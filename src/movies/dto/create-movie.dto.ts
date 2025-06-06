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
  @ApiProperty({ description: 'Name of the movie' })
  @IsString()
  title: string

  @ApiProperty({ description: 'Duration of the movie in minutes' })
  @IsInt()
  duration: number

  @ApiPropertyOptional({ description: 'Link of the movie thumbnail' })
  @IsOptional()
  @IsString()
  thumbnail?: string

  @ApiPropertyOptional({ description: 'Link of the movie trailer' })
  @IsOptional()
  @IsString()
  trailer?: string

  @ApiProperty({
    description: 'Age classification of the movie',
    enum: Classification,
  })
  @IsEnum(Classification)
  classification: Classification

  @ApiProperty({ description: 'Description of the movie' })
  @IsString()
  description: string

  @ApiProperty({ description: 'Distributor of the movie' })
  @IsString()
  distributor: string

  @ApiProperty({ description: 'Release date of the movie in ISO format' })
  @IsDateString()
  releaseDate: string

  @ApiPropertyOptional({
    description:
      "IDs of the categories of the movies. See them in the 'categories' resource",
  })
  @IsNumber({}, { each: true })
  categoriesIds?: number[]
}
