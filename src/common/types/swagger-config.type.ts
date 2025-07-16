import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export type SwaggerConfig = {
  title: string
  description: string
  version: string
  securityRequirements: string
  bearerAuth?: SecuritySchemeObject
}
