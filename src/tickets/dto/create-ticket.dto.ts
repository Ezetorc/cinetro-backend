import { ApiProperty } from '@nestjs/swagger'
import { TicketStatus } from '@prisma/client'
import { IsDateString, IsEnum, IsInt } from 'class-validator'

export class CreateTicketDto {
  @ApiProperty({
    description: 'Id of the user',
    type: 'number',
    example: 1
  })
  @IsInt()
  userId: number

  @ApiProperty({
    description: 'Id of the seat',
    type: 'number',
    example: 2
  })
  @IsInt()
  seatId: number

  @ApiProperty({
    description: 'Id of the screening',
    type: 'number',
    example: 5
  })
  @IsInt()
  screeningId: number

  @ApiProperty({
    description: 'Status of the ticket',
    enum: TicketStatus,
    example: 'SOLD'
  })
  @IsEnum(TicketStatus)
  status: TicketStatus

  @ApiProperty({
    description: 'Reserved date of the ticket in ISO format',
    type: 'string',
    example: '2001-01-02T18:00:00.000Z'
  })
  @IsDateString()
  reservedAt: string
}
