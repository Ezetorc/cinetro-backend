export const resources = [
  'category',
  'category:all',
  'cinema',
  'cinema:all',
  'movie',
  'movie:all',
  'room',
  'room:all',
  'screening',
  'screening:all',
  'seat',
  'seat:all',
  'ticket',
  'ticket:own',
  'ticket:of-cinema',
  'ticket:all',
  'user-role',
  'user',
  'user:own',
  'user:all',
  'user:authorization',
  'all'
] as const
export const pureResources = resources.filter((resource) => resource !== 'all')
export type Resource = (typeof resources)[number]
