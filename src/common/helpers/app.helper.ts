import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SWAGGER_CONFIG } from 'src/configuration/swagger.configuration'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

export class App {
  private app: INestApplication
  private swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth(SWAGGER_CONFIG.bearerAuth)
    .addSecurityRequirements(SWAGGER_CONFIG.securityRequirements)
    .build()

  constructor (app: INestApplication) {
    this.app = app
  }

  setupSwagger (): App {
    const swaggerDocument = SwaggerModule.createDocument(
      this.app,
      this.swaggerConfig
    )
    const theme = new SwaggerTheme()
    const options = {
      explorer: true,
      customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
    }

    SwaggerModule.setup('docs', this.app, swaggerDocument, options)

    return this
  }

  disableHeader (header: string): App {
    const expressApp = this.app.getHttpAdapter().getInstance()

    expressApp.disable(header)

    return this
  }

  get nest (): INestApplication {
    return this.app
  }
}
