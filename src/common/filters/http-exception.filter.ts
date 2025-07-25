import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    const exceptionIsString = typeof exceptionResponse === 'string'
    const exceptionHasMessage =
      typeof exceptionResponse === 'object' && Object.hasOwn(exceptionResponse, 'message')
    const message = exceptionIsString
      ? exceptionResponse
      : exceptionHasMessage
        ? exceptionResponse['message']
        : 'Unexpected error'

    response.status(status).json({ error: message })
  }
}
