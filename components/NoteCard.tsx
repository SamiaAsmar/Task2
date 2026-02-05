'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  Stack,
  useTheme,
  Tooltip
} from '@mui/material'
import { Pencil, Plus, Trash2, StickyNote } from 'lucide-react'
import toast from 'react-hot-toast'
import { Note } from '@/@core/types/note'
import { useNotes } from '@/@core/context/NotesContext'
import { usePermission } from '@/@core/hooks/usePermission'
import { Acl } from './ACL'
import { useAuth } from '@/@core/context/AuthContext'
import { Logout } from './Logout'

export default function NoteBoard() {
  const theme = useTheme()
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [openDialog, setOpenDialog] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', description: '' })
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const canCreate = usePermission({ action: 'create', subject: 'note' })

  const { user } = useAuth()

  const handleOpenAdd = () => {
    if (!canCreate) return
    setCurrentNote(null)
    setNewNote({ title: '', description: '' })
    setOpenDialog(true)
  }

  const handleOpenEdit = (note: Note) => {
    setCurrentNote(note)
    setNewNote({ title: note.title, description: note.description })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setNewNote({ title: '', description: '' })
    setCurrentNote(null)
  }

  const handleSaveNote = async () => {
    if (!newNote.title.trim()) return
    if (!user) return

    try {
      if (currentNote) {
        await updateNote(currentNote.id, {
          title: newNote.title,
          description: newNote.description,
          userId: currentNote.userId
        })
        toast.success('Note updated successfully')
      } else {
        await addNote({
          title: newNote.title,
          description: newNote.description,
          userId: user.id
        })
        toast.success('Note created successfully')
      }
      handleCloseDialog()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id)
      toast.success('Note deleted successfully')
    } catch {
      toast.error('Failed to delete note')
    }
  }
  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='lg'>
        <Stack direction='row' justifyContent='flex-end' mb={3}>
          <Logout />
        </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={6}>
          <Box>
            <Typography variant='h4' fontWeight='800' color='text.primary' gutterBottom>
              Team Notes
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Keep track of your teams thoughts and tasks.
            </Typography>
          </Box>
          <Acl permission={{ action: 'create', subject: 'note' }}>
            <Button variant='contained' startIcon={<Plus size={18} />} onClick={handleOpenAdd}>
              Create Note
            </Button>
          </Acl>
        </Stack>

        {notes.length === 0 && (
          <Paper
            sx={{
              textAlign: 'center',
              borderColor: 'divider',
              bgcolor: 'transparent'
            }}
          >
            <StickyNote size={48} color={theme.palette.text.disabled} style={{ marginBottom: 16 }} />
            <Typography variant='h6' color='text.secondary'>
              No notes found
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              Click Create Note to get started.
            </Typography>
          </Paper>
        )}

        <Grid container spacing={3}>
          {notes.map(note => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note.id} sx={{ display: 'flex' }}>
              <Card
                elevation={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: 'divider',
                  transition: '0.3s',
                  flexGrow: 1,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant='h6' fontWeight='700' gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                    {note.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Acl permission={{ action: 'update', subject: 'note' }} note={note}>
                    <Tooltip title='Edit Note' arrow>
                      <IconButton
                        size='small'
                        onClick={() => handleOpenEdit(note)}
                        sx={{
                          color: 'primary.main',
                          bgcolor: 'primary.50',
                          '&:hover': { bgcolor: 'primary.100' }
                        }}
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                  </Acl>
                  <Acl permission={{ action: 'delete', subject: 'note' }}>
                    <Tooltip title='Delete Note' arrow>
                      <IconButton
                        size='small'
                        onClick={() => handleDelete(note.id)}
                        sx={{
                          color: 'error.main',
                          bgcolor: 'error.50',
                          '&:hover': { bgcolor: 'error.100' }
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Acl>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth='xs'
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>{currentNote ? 'Edit your note' : 'New note'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                autoFocus
                label='Title'
                fullWidth
                variant='outlined'
                value={newNote.title}
                onChange={e => setNewNote({ ...newNote, title: e.target.value })}
              />
              <TextField
                label='Description'
                fullWidth
                multiline
                rows={4}
                variant='outlined'
                value={newNote.description}
                onChange={e => setNewNote({ ...newNote, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color='inherit' sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSaveNote} disabled={!newNote.title.trim()}>
              {currentNote ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
