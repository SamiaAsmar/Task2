export const PERMISSIONS = {
  VIEW_NOTE: 'view_notes',
  CREATE_NOTE: 'create_note',
  EDIT_NOTE: 'update_note',
  DELETE_NOTE: 'delete_note'
};
export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
};
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MEMBER]: [PERMISSIONS.VIEW_NOTE, PERMISSIONS.CREATE_NOTE, PERMISSIONS.EDIT_NOTE],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_NOTE],
}
