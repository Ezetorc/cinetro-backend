import { Action } from './action.type'
import { Resource } from './resource.type'

export type PolicyRule = `${string}/${Action}/${Resource}`
