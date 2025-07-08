import { handle } from './handle.utility'

export async function catchTo<T>(promise: Promise<T>) {
  try {
    const result = await promise
    return result
  } catch (error) {
    handle(error)
    return null as T
  }
}
