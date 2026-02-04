import { useAuth } from '../context/AuthContext'
export const usePermission = (permission: string) => {
  const { permissions } = useAuth()
  return permissions.includes(permission)
}
