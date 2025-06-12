import { DocumentBuilder } from '@nestjs/swagger'
import { Role } from '@prisma/client'

const ENV = process.env

export const PORT = ENV.PORT ? Number(ENV.PORT) : 3000
export const SALT_ROUNDS = ENV.SALT_ROUNDS ? Number(ENV.SALT_ROUNDS) : 10
export const JWT_SECRET = ENV.JWT_SECRET ? String(ENV.JWT_SECRET) : 'secret_key'
export const DEFAULT_REQUIRED_ROLES: Role[] = ['ADMIN']
export const DEFAULT_USER_ROLE: Role = 'USER'
export const SWAGGER_CONFIG = new DocumentBuilder()
  .setTitle('Cinemax')
  .setDescription('Cinema tickets shop API')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    name: 'Authorization',
    description: 'Enter your bearer token',
  })
  .addSecurityRequirements('bearer')
  .build()
