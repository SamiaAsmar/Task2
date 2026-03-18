'use client'

import { useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import ProjectsSidebar from '@/components/projects/ProjectsSidebar'
import { useAppDispatch, useAppSelector } from '@/@core/hooks/redux'
import { fetchProjects } from '../features/projects/projectSlice'

export default function WorkspacePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)
  const { loading } = useAppSelector(state => state.projects)

  useEffect(() => {
    if (user) {
      dispatch(fetchProjects())
    }
  }, [dispatch, user])

  if (!user) return <Typography>Loading workspace...</Typography>
  if (loading) return <Typography>Loading projects...</Typography>

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container>
        <Typography variant='h5' mb={2}>
          Workspace
        </Typography>

        <ProjectsSidebar />
      </Container>
    </Box>
  )
}
