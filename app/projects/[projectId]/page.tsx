'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material'
import { Project } from '@/@core/types/project'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import SectionsContainer from '@/components/sections/SectionsContainer'
import { useAppDispatch, useAppSelector } from '@/@core/hooks/redux'
import {
  createSection,
  updateSection,
  selectEditDialogOpen,
  openEditDialog,
  closeEditDialog,
  fetchSections
} from '../../features/sections/sectionSlice'
import { fetchNotesBySection } from '@/app/features/notes/noteSlice'
import { fetchSingleProject } from '@/app/features/projects/projectSlice'

type Props = {
  params: { projectId: string }
}

export default function ProjectPage({ params }: Props) {
  const [project] = useState<Project | null>(null)
  const [sectionName, setSectionName] = useState('')

  const editingSectionId = useAppSelector(state => state.sections.editingSectionId)
  const editDialogOpen = useAppSelector(selectEditDialogOpen)
  const dispatch = useAppDispatch()

useEffect(() => {
    dispatch(fetchSingleProject(params.projectId))
      .unwrap()
      .catch(() => {
        toast.error('Failed to load project')
      })
  }, [dispatch, params.projectId])
  useEffect(() => {
    dispatch(fetchSections(Number(params.projectId)))
  }, [dispatch, params.projectId])

  const sections = useAppSelector(state => state.sections.sections)

  useEffect(() => {
    if (sections.length > 0) {
      console.log('Fetching notes for sections:', sections)
      sections.forEach(section => {
        dispatch(fetchNotesBySection(section.id))
      })
    }
  }, [dispatch, sections])

  const handleOpenAdd = () => {
    setSectionName('')
    dispatch(openEditDialog(0))
  }

  const handleSave = async () => {
    if (!project || !sectionName.trim()) return

    try {
      if (editingSectionId && editingSectionId !== 0) {
        await dispatch(updateSection({ id: editingSectionId, data: { name: sectionName } })).unwrap()
        toast.success('Section updated')
      } else {
        await dispatch(createSection({ projectId: project.id, data: { name: sectionName } })).unwrap()
        toast.success('Section added')
      }
      setSectionName('')
      dispatch(closeEditDialog())
    } catch {
      toast.error('Failed to save section')
    }
  }

  if (!project) return <Typography sx={{ p: 4 }}>Loading project...</Typography>

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Stack direction='row' justifyContent='flex-end' m={3}>
        <Button variant='contained' startIcon={<Plus />} onClick={handleOpenAdd}>
          Add Section
        </Button>
      </Stack>

      <Card elevation={3}>
        <CardContent>
          <Typography variant='h4' fontWeight={600}>
            {project.name}
          </Typography>
          <Typography color='text.secondary'>Owner: {project.owner}</Typography>
          {project.description && <Typography>{project.description}</Typography>}
        </CardContent>
      </Card>

      <SectionsContainer />

      <Dialog open={editDialogOpen} onClose={() => dispatch(closeEditDialog())}>
        <DialogTitle>{editingSectionId && editingSectionId !== 0 ? 'Edit Section' : 'Add Section'}</DialogTitle>
        <DialogContent>
          <TextField
            label='Section Name'
            fullWidth
            value={sectionName}
            onChange={e => setSectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSectionName('')
              dispatch(closeEditDialog())
            }}
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave}>
            {editingSectionId && editingSectionId !== 0 ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
