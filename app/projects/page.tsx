'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material'
import toast from 'react-hot-toast'
import { Project } from '@/@core/types/project'
import ProjectsDetails from '@/components/projects/ProjectDetails'
import AddProjectDialog from '@/components/ProjectDialog'

import { useAppDispatch, useAppSelector } from '@/@core/hooks/redux'
import {
  fetchProjects,
  addProject,
  updateProject,
  selectAllProjects,
  selectEditingProjectId,
  selectEditDialogOpen,
  selectLoading,
  closeEditDialog
} from '../features/projects/projectSlice'
import { fetchUser } from '../features/auth/authSlice'

export default function ProjectsPage() {
  const dispatch = useAppDispatch()

  const projects = useAppSelector(selectAllProjects)
  const loading = useAppSelector(selectLoading)
  const editProjectId = useAppSelector(selectEditingProjectId)
  const editDialogOpen = useAppSelector(selectEditDialogOpen)
  const user = useAppSelector(state => state.auth.user)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [openAdd, setOpenAdd] = useState(false)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      dispatch(fetchProjects())
    }
  }, [dispatch, user])
  useEffect(() => {
    const project = projects.find(p => p.id === editProjectId)
    setEditingProject(project || null)
  }, [editProjectId, projects])

  const handleUpdateProject = () => {
    if (!editingProject) return

    dispatch(
      updateProject({
        id: editingProject.id,
        data: editingProject
      })
    )
    toast.success('Project updated')
    dispatch(closeEditDialog())
  }

  const handleAddProject = async (project: Project) => {
    try {
      await dispatch(addProject(project)).unwrap()
      toast.success('Project added successfully')
    } catch {
      toast.error('Failed to add project')
    }
  }
  if (loading) return <Typography sx={{ p: 4 }}>Loading projects...</Typography>
  if (!user) return <Typography sx={{ p: 4 }}>User not found</Typography>

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h4'>Projects Dashboard</Typography>
        <Button variant='contained' onClick={() => setOpenAdd(true)}>
          Add Project
        </Button>
      </Stack>

      {projects.length === 0 ? <Typography sx={{ p: 4 }}>No projects available</Typography> : <ProjectsDetails />}

      <Dialog open={editDialogOpen} onClose={() => dispatch(closeEditDialog())} fullWidth>
        <DialogTitle>Edit Project</DialogTitle>

        {editingProject && (
          <>
            <DialogContent>
              <TextField
                label='Project Name'
                fullWidth
                margin='dense'
                value={editingProject.name}
                onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
              />

              <TextField
                label='Owner'
                fullWidth
                margin='dense'
                value={editingProject.owner}
                onChange={e => setEditingProject({ ...editingProject, owner: e.target.value })}
              />

              <TextField
                label='Description'
                fullWidth
                margin='dense'
                multiline
                value={editingProject.description}
                onChange={e =>
                  setEditingProject({
                    ...editingProject,
                    description: e.target.value
                  })
                }
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => dispatch(closeEditDialog())}>Cancel</Button>
              <Button variant='contained' onClick={handleUpdateProject}>
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <AddProjectDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAddProject}
        users={user ? [user] : []}
      />
    </Box>
  )
}
