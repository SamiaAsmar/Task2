'use client'

import { Stack, IconButton, Tooltip } from '@mui/material'
import { useAuth } from '@/@core/context/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export const Logout = () => {
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    router.replace('/login')
    logout()
  }

  if (!user) return null

  return (
    <Stack direction='row' justifyContent='flex-end' p={2}>
      <Tooltip title='Logout' arrow>
        <IconButton onClick={handleLogout} size='small' color='error'>
          <LogOut size={22} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
