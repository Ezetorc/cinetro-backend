import { PolicyRoleActionChain } from './policy-role-action-chain.type'
import { Resource } from './resource.type'

export type PolicyRoleAction = (resource: Resource) => PolicyRoleActionChain
