import { useAuth } from '@/@core/context/AuthContext'
import { Note } from '@/@core/types/note'
import { Permission, ROLE_PERMISSIONS, ROLES } from '@/@core/types/permissions'

type AclProps = {
  permission: Permission
  children: React.ReactNode
  note?: Note
}

export const Acl = ({ permission, children, note }: AclProps) => {
  const { user, loading } = useAuth()

  if (loading || !user) return null

  const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || []

  const hasPermission = userPermissions.some(p => p.action === permission.action && p.subject === permission.subject)

  if (!hasPermission) return null

  if (permission.action === 'update' && permission.subject === 'note' && note) {
    if (user.role === ROLES.ADMIN) return <>{children}</>

    if (user.role === ROLES.MEMBER && note.userId === user.id) return <>{children}</>

    return null
  }

  return <>{children}</>
}
