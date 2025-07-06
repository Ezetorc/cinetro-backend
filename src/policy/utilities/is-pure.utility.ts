import { Action } from '../types/action.type'
import { Resource } from '../types/resource.type'

export function isPure(action: Action | undefined): boolean
export function isPure(resource: Resource | undefined): boolean
export function isPure(actionOrResource: Action | Resource | undefined): boolean {
  return actionOrResource !== 'all' && actionOrResource !== 'manage'
}
