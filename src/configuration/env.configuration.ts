const ENV = process.env

export function envConfiguration () {
  return {
    port: ENV.PORT ? parseInt(ENV.PORT, 10) : 3000,
    saltRounds: ENV.SALT_ROUNDS ? parseInt(ENV.SALT_ROUNDS) : 10,
    jwt: {
      secret: ENV.JWT_SECRET ?? 'defaultSecret',
      expiresIn: ENV.JWT_EXPIRES_IN || '3600s'
    },
    redis: {
      host: ENV.REDIS_HOST || 'localhost',
      port: ENV.REDIS_PORT ? parseInt(ENV.REDIS_PORT, 10) : 6379
    }
  }
}
