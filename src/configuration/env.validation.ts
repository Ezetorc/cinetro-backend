import * as Joi from 'joi'

export const envValidation = Joi.object({
  PORT: Joi.number().default(3000),
  HOST_PORT: Joi.number().default(3000),
  SALT_ROUNDS: Joi.number().default(10),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('3600s'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_HOST: Joi.string().default('localhost'),
  MYSQL_USER: Joi.string().default('root'),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_URL: Joi.string().required()
})
