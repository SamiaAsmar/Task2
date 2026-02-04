'use client'

import React from 'react'
import { useAuth } from '@/@core/context/AuthContext'
import { Button, Box, Container } from '@mui/material'
import { useRouter } from 'next/navigation'
import NoteBoard from '@/components/NoteCard'

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <Container maxWidth='lg'>
      {!user && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 2 }}>
          <Button variant='contained' onClick={() => router.push('/login')}>
            Login
          </Button>
        </Box>
      )}

      <NoteBoard />
    </Container>
  )
}
