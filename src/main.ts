import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT } from './settings'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/httpException.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Cinemax')
    .setDescription('Cinema tickets shop API')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  app
    .useGlobalInterceptors(new ResponseInterceptor())
    .useGlobalFilters(new HttpExceptionFilter())
    .useGlobalPipes(new ValidationPipe({ whitelist: true }))
    .useGlobalInterceptors()
    .listen(PORT)
}
bootstrap()
