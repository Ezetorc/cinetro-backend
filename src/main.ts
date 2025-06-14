import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT } from './settings'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { App } from './common/helpers/app.helper'

NestFactory.create(AppModule).then(nestApp => {
  const app = new App(nestApp)

  app.setupSwagger()
  app.disableHeader('x-powered-by')
  app.nest.useGlobalInterceptors(new ResponseInterceptor())
  app.nest.useGlobalFilters(new HttpExceptionFilter())
  app.nest.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.nest.useGlobalInterceptors()
  app.nest.listen(PORT)
})
