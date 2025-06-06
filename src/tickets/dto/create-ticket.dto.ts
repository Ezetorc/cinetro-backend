import { TicketStatus } from '@prisma/client'
import { IsDateString, IsEnum, IsInt } from 'class-validator'

export class CreateTicketDto {
  @IsInt()
  userId: number

  @IsInt()
  seatId: number

  @IsInt()
  screeningId: number

  @IsEnum(TicketStatus)
  status: TicketStatus

  @IsDateString()
  reservedAt: string
}
