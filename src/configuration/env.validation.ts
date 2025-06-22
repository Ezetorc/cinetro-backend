import * as Joi from 'joi'

export const envValidation = Joi.object({
  PORT: Joi.number().default(3000),
  SALT_ROUNDS: Joi.number().default(10),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('3600s'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379)
})

