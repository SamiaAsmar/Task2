'use client'

import { Button, Box } from '@mui/material'
import { useAuth } from '@/@core/context/AuthContext'
import { useRouter } from 'next/navigation'

export const Logout = () => {
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <Box display='flex' justifyContent='flex-end' p={2}>
      <Button variant='outlined' onClick={handleLogout} size='small' color='error'>
        Logout
      </Button>
    </Box>
  )
}
