import { PolicyRoleChain } from '../entities/policy-role-chain.entity'
import { Action } from './action.type'
import { Resource } from './resource.type'

export type PolicyRoleAction = (action: Action, resource: Resource) => PolicyRoleChain
