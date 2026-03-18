'use client'

import { Typography, Paper } from '@mui/material'

export default function AdminTestPage() {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography variant='h4' gutterBottom>
        Admin Test Page
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Only users with admin role can see this page.
      </Typography>
    </Paper>
  )
}
