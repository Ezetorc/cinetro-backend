import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export type SwaggerConfig = {
  title: string
  description: string
  version: string
  bearerAuth: SecuritySchemeObject
  securityRequirements: string
}
