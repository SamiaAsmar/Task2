import { useAuth } from '@/@core/context/AuthContext'
import { Note } from '@/@core/types/note'

type AclProps = {
  permission: string
  children: React.ReactNode
  note?: Note
}

export const Acl = ({ permission, children, note }: AclProps) => {
  const { user, permissions, loading } = useAuth()

  if (loading || !user) return null

  if (!permissions.includes(permission)) return null

  if (permission === 'update_note' && note) {
    if (user.role === 'admin') return <>{children}</>
    if (user.role === 'member' && note.userId === user.id) return <>{children}</>
    return null
  }

  return <>{children}</>
}
