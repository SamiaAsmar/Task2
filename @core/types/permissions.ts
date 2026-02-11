export type Action = 'create' | 'view' | 'update' | 'delete' | 'admin'
export type Subject = 'note' | 'access' | 'projects' | 'sections'

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
    permission('admin', 'access'),
    permission('view', 'projects')
  ],
  [ROLES.MEMBER]: [
    permission('view', 'note'),
    permission('create', 'note'),
    permission('update', 'note'),
    permission('view', 'projects')
  ],
  [ROLES.VIEWER]: [permission('view', 'note')]
} as const
