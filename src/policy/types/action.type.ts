export const actions = ['read', 'create', 'update', 'delete', 'manage'] as const
export const pureActions = actions.filter((action) => action !== 'manage')
export type Action = (typeof actions)[number]
