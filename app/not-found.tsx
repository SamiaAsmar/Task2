'use client'

import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      minHeight='100vh'
      textAlign='center'
      gap={2}
    >
      <Typography variant='h2' fontWeight='700'>
        404
      </Typography>
      <Typography variant='h6'>Page not found</Typography>
      <Button variant='contained' onClick={() => router.push('/')}>
        Go Home
      </Button>
    </Box>
  )
}
