const ACTIONS = ['create', 'view', 'update', 'delete'] as const
const ENTITIES = ['note'] as const

export const PERMISSIONS = ENTITIES.reduce(
  (acc, entity) => {
    ACTIONS.forEach(action => {
      const key = `${action.toUpperCase()}_${entity.toUpperCase()}`
      acc[key] = `${action}_${entity}`
    })
    return acc
  },
  {} as Record<string, string>
)

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
}
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [...Object.values(PERMISSIONS), 'admin_access'],
  [ROLES.MEMBER]: [PERMISSIONS.VIEW_NOTE, PERMISSIONS.CREATE_NOTE, PERMISSIONS.UPDATE_NOTE],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_NOTE]
}
