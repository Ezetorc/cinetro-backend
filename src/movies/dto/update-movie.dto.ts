import { ApiSchema, PartialType } from '@nestjs/swagger'
import { CreateMovieDto } from './create-movie.dto'

@ApiSchema({ description: 'Update Movie DTO' })
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
