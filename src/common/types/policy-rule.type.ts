import { JWTUser } from 'src/users/entities/jwt-user.entity'
import { RoleName } from '../enums/role-name.enum'
import { Action } from './action.type'
import { Resource } from './resource.type'

export type PolicyRule = {
  action: Action
  resource: Resource
  condition?: (user: JWTUser, resource: object) => boolean
  roleName: RoleName
}
