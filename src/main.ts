import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT, SWAGGER_CONFIG } from './settings'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { SwaggerModule } from '@nestjs/swagger'
import { disableHeader } from './common/utilities/disable-header.utility'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

NestFactory.create(AppModule).then(app => {
  const swaggerDocument = SwaggerModule.createDocument(app, SWAGGER_CONFIG)
  const theme = new SwaggerTheme()
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  }

  SwaggerModule.setup('docs', app, swaggerDocument, options)

  disableHeader(app, 'x-powered-by')

  app
    .useGlobalInterceptors(new ResponseInterceptor())
    .useGlobalFilters(new HttpExceptionFilter())
    .useGlobalPipes(new ValidationPipe({ whitelist: true }))
    .useGlobalInterceptors()
    .listen(PORT)
})
