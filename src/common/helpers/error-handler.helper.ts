import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export class ErrorHandler {
  static handle (error: any): void {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw new NotFoundException('Unexpected error')
    }

    this.handlePrismaError(error)

    throw new NotFoundException('Unexpected error')
  }

  private static handlePrismaError (error: PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2003': {
        const constraintFields = error.meta?.constraint as string[] | undefined

        const message = constraintFields?.length
          ? `Error because other entities are related with this ${constraintFields.join(
              ', '
            )}, or the constraints don't exist`
          : `Error because other entities are related with this entity or they don't exist`

        throw new BadRequestException(message)
      }

      case 'P2025': {
        const cause = error.meta?.cause as string | undefined
        const message = cause ?? 'Unexpected error'
        throw new NotFoundException(message)
      }

      default:
        throw new BadRequestException('Unexpected error')
    }
  }
}
