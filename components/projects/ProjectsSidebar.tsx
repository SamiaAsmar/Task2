'use client'
import { Card, Typography, List, Button, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import ProjectList from './ProjectList'

export default function ProjectsSidebar() {
  const router = useRouter()

  return (
    <Card sx={{ width: 320 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6'>Projects</Typography>
        <Button size='small' onClick={() => router.push('/projects')}>
          Browse
        </Button>
      </Stack>

      <List>
        <ProjectList />
      </List>
    </Card>
  )
}
