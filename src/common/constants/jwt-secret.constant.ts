import { ENV } from "./env.constant";

export const JWT_SECRET = ENV.JWT_SECRET ? String(ENV.JWT_SECRET) : 'secret_key'
