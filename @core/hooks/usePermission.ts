import { useAuth } from '../context/AuthContext'
import { Note } from '../types/note'
import { Permission, ROLE_PERMISSIONS, ROLES } from '../types/permissions'
export const usePermission = (permission: Permission, note?: Note) => {
  const { user, loading } = useAuth()
  if (loading || !user) return false

  const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || []

  const hasPermission = userPermissions.some(p => p.action === permission.action && p.subject === permission.subject)

  if (!hasPermission) return false

  if (permission.action === 'update' && permission.subject === 'note' && note) {
    if (user.role === ROLES.ADMIN) return true
    if (user.role === ROLES.MEMBER && note.userId === user.id) return true
    return false
  }

  return true
}
