'use client'

import React from 'react'
import { Button, Container, Typography, Stack } from '@mui/material'
import { Home, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <Container
      maxWidth='md'
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <Stack spacing={3} alignItems='center'>
        <Lock size={64} />
        <Typography variant='h2' fontWeight={700}>
          401
        </Typography>
        <Typography variant='h5' color='text.secondary'>
          Unauthorized
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          You don’t have permission to access this page.
        </Typography>
        <Button variant='contained' startIcon={<Home />} onClick={() => router.push('/')}>
          Go to Home
        </Button>
      </Stack>
    </Container>
  )
}
