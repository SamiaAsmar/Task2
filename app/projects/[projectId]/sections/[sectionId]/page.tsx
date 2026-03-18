'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  TextField
} from '@mui/material'
import NotesList from '@/components/Notes/NotesList'
import { useAppDispatch, useAppSelector } from '@/@core/hooks/redux'
import { addNote, fetchNotesBySection, updateNote, closeEditDialog } from '@/app/features/notes/noteSlice'
import { fetchSections } from '@/app/features/sections/sectionSlice'

export default function SectionPage() {
  const params = useParams() as { projectId: string; sectionId: string }
  const sectionId = Number(params.sectionId)
  const projectId = Number(params.projectId)

  const [openAdd, setOpenAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const dispatch = useAppDispatch()
  const { loading, editDialogOpen, editingNote } = useAppSelector(state => state.notes)
  const sections = useAppSelector(state => state.sections.sections)

  const section = sections.find(s => s.id === sectionId)

  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')

  useEffect(() => {
    dispatch(fetchSections(projectId))
    dispatch(fetchNotesBySection(sectionId))
  }, [dispatch, projectId, sectionId])

  useEffect(() => {
    if (editingNote) {
      setEditingTitle(editingNote.title)
      setEditingDescription(editingNote.description)
    }
  }, [editingNote])

  const handleAddNote = async () => {
    try {
      await dispatch(
        addNote({
          sectionId,
          note: {
            title: newTitle,
            description: newDescription
          }
        })
      ).unwrap()

      setNewTitle('')
      setNewDescription('')
      setOpenAdd(false)
    } catch (err) {
      console.error('Error adding note:', err)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return
    try {
      await dispatch(
        updateNote({
          id: editingNote.id,
          note: { title: editingTitle, description: editingDescription }
        })
      ).unwrap()

      dispatch(closeEditDialog())
    } catch (err) {
      console.error('Error updating note:', err)
    }
  }

  if (loading) return <Typography sx={{ p: 4 }}>Loading section...</Typography>
  if (!section) return <Typography sx={{ p: 4 }}>Section not found</Typography>

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h4' fontWeight={600}>
            {section.name}
          </Typography>
        </CardContent>
      </Card>

      <Button variant='contained' onClick={() => setOpenAdd(true)} sx={{ mb: 2 }}>
        Add Note
      </Button>

      <NotesList />

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            label='Title'
            fullWidth
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label='Description'
            fullWidth
            multiline
            rows={4}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleAddNote}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => dispatch(closeEditDialog())}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            label='Title'
            fullWidth
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label='Description'
            fullWidth
            multiline
            rows={4}
            value={editingDescription}
            onChange={e => setEditingDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(closeEditDialog())}>Cancel</Button>
          <Button variant='contained' onClick={handleUpdateNote}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
