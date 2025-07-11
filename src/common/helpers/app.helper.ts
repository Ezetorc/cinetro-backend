import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Application } from 'express'
import { SWAGGER_CONFIG } from 'src/configuration/swagger.configuration'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

export class App {
  public configService: ConfigService
  private app: INestApplication
  private swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth(SWAGGER_CONFIG.bearerAuth)
    .addSecurityRequirements(SWAGGER_CONFIG.securityRequirements)
    .build()

  constructor(app: INestApplication) {
    this.app = app
    this.configService = app.get(ConfigService)
  }

  setupSwagger(): App {
    const swaggerDocument = SwaggerModule.createDocument(this.app, this.swaggerConfig)
    const theme = new SwaggerTheme()
    const options = {
      explorer: true,
      customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
    }

    SwaggerModule.setup('docs', this.app, swaggerDocument, options)

    return this
  }

  removeHeader(header: string): App {
    const expressApp = this.app.getHttpAdapter().getInstance() as Application

    expressApp.disable(header)

    return this
  }

  get port(): number {
    return this.configService.getOrThrow<number>('port')
  }

  get nest(): INestApplication {
    return this.app
  }
}
