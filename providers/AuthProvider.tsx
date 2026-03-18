'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/@core/hooks/redux'
import { fetchUser } from '@/app/features/auth/authSlice'
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  return <>{children}</>
}
