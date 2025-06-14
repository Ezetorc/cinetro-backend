import { ENV } from './env.constant'

export const PORT = ENV.PORT ? Number(ENV.PORT) : 3000
