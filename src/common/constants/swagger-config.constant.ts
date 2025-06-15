import { SwaggerConfig } from '../types/swagger-config.type'

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Cinemax',
  description: 'Cinema tickets shop API',
  version: '1.0',
  securityRequirements: 'bearer',
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    name: 'Authorization',
    description: 'Enter your bearer token'
  }
}
