import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { App } from './common/helpers/app.helper'
import { AppModule } from './app.module'

NestFactory.create(AppModule).then((nestApp) => {
  const app = new App(nestApp)

  app.setupSwagger()
  app.removeHeader('x-powered-by')
  app.nest.useGlobalInterceptors(new ResponseInterceptor())
  app.nest.useGlobalFilters(new HttpExceptionFilter())
  app.nest.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.nest.useGlobalInterceptors()
  app.nest.listen(app.port)
})
