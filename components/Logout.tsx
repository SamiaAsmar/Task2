'use client'
import { Stack, IconButton, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export const Logout = () => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    toast.success('Logged out successfully')
    router.push('/login')
  }

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
