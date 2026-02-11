import { useAppSelector } from '@/@core/hooks/redux'
import { Note } from '@/@core/types/note'
import { Permission, ROLE_PERMISSIONS, ROLES } from '@/@core/types/permissions'
import { Project } from '@/@core/types/project'

type AclProps = {
  permission: Permission
  children: React.ReactNode
  note?: Note
  project: Project
}

export const Acl = ({ permission, children, project }: AclProps) => {
  const user = useAppSelector(state => state.auth.user)
  const loading = useAppSelector(state => state.auth.loading)

  if (loading || !user) {
    console.log('ACL: loading or no user')
    return null
  }

  const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || []
  const hasPermission = userPermissions.some(p => p.action === permission.action && p.subject === permission.subject)

  if (!hasPermission) return null

  if (permission.action === 'view' && permission.subject === 'projects' && project) {
    if (user.role === ROLES.ADMIN) return <>{children}</>
    if (user.role === ROLES.MEMBER && project.owner == user.name) return <>{children}</>
    return null
  }

  return null
}
