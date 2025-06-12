import { OmitType } from '@nestjs/swagger'
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto'

export class RegisterUserDto extends OmitType(CreateUserDto, ['role']) {}
