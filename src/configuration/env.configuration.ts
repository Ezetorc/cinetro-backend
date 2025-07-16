const ENV = process.env as Record<string, any>

export function envConfiguration() {
  return {
    app: {
      port: parseInt(ENV.PORT)
    },
    jwt: {
      secret: ENV.JWT_SECRET,
      expiresIn: ENV.JWT_EXPIRES_IN,
      saltRounds: parseInt(ENV.SALT_ROUNDS)
    },
    redis: {
      host: ENV.REDIS_HOST,
      port: parseInt(ENV.REDIS_PORT)
    },
    mysql: {
      host: ENV.MYSQL_HOST,
      port: parseInt(ENV.MYSQL_PORT),
      user: ENV.MYSQL_USER,
      password: ENV.MYSQL_PASSWORD,
      database: ENV.MYSQL_DATABASE
    }
  }
}
