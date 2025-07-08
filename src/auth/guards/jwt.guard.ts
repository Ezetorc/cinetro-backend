import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_error: any, user: any) {
    const userId = this._getIdOf(user)

    if (userId === undefined) {
      return null as TUser
    } else {
      return user as TUser
    }
  }

  private _hasId(input: any): boolean {
    const isNull = input === null
    const isObject = !isNull ? typeof input === 'object' : false
    const hasId = isObject ? Object.prototype.hasOwnProperty.call(input, 'id') : false
    const idIsNumber = hasId ? typeof input.id === 'number' : false
    const idIsString = hasId ? typeof input.id === 'string' : false
    const isValidString = idIsString ? (input.id as string).trim() !== '' : false
    const isValidNumber = idIsNumber ? !isNaN(input.id) : false

    return isValidNumber || isValidString
  }

  private _getIdOf(input: any): number | undefined {
    if (!this._hasId(input)) return undefined

    const { id } = input as { id: string | number }
    const idIsString = typeof id === 'string'
    const idIsNumber = typeof id === 'number'

    return idIsString ? parseInt(id, 10) : idIsNumber ? id : undefined
  }
}
