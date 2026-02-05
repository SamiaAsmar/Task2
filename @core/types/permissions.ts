export type Action = 'create' | 'view' | 'update' | 'delete' | 'admin'
export type Subject = 'note' | 'access'

export type Permission = {
  action: Action
  subject: Subject
}

const permission = (action: Action, subject: Subject): Permission => ({
  action,
  subject
})

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    permission('create', 'note'),
    permission('view', 'note'),
    permission('update', 'note'),
    permission('delete', 'note'),
    permission('admin', 'access')
  ],
  [ROLES.MEMBER]: [permission('view', 'note'), permission('create', 'note'), permission('update', 'note')],
  [ROLES.VIEWER]: [permission('view', 'note')]
} as const
