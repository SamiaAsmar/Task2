'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/@core/context/AuthContext'

type Props = {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export const RequirePermission = ({ children, requiredPermissions = [] }: Props) => {
  const { user, permissions, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (!requiredPermissions.every(p => permissions.includes(p))) {
        router.replace('/unauthorized')
      }
    }
  }, [user, permissions, loading, router, requiredPermissions])

  if (loading) return null
  if (!user || !requiredPermissions.every(p => permissions.includes(p))) return null

  return <>{children}</>
}
