import { ENV } from "./env.constant";

export const SALT_ROUNDS = ENV.SALT_ROUNDS ? Number(ENV.SALT_ROUNDS) : 10
