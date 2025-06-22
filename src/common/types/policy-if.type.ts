import { JWTUser } from 'src/users/entities/jwt-user.entity'
import { PolicyRoleActionChain } from './policy-role-action-chain.type'

export type PolicyIf = <M extends object>(
  condition: (user: JWTUser, resource: M) => boolean
) => PolicyRoleActionChain
