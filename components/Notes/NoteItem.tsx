'use client'
import { useAppDispatch } from '@/@core/hooks/redux'
import { deleteNote, fetchNotesBySection, openEditDialog } from '@/app/features/notes/noteSlice'
import { Card, CardContent, Typography, IconButton, Stack } from '@mui/material'
import { Pencil, Trash } from 'lucide-react'
import { Note } from '@/@core/types/note'

type Props = {
  note: Note
}

export default function NoteItem({ note }: Props) {
  const dispatch = useAppDispatch()

  const handleDeleteNote = async () => {
    try {
      await dispatch(deleteNote(note.id)).unwrap()
      dispatch(fetchNotesBySection(note.sectionId))
    } catch (err) {
      console.error('Error deleting note:', err)
    }
  }

  const handleUpdate = () => {
    dispatch(
      openEditDialog({
        noteId: note.id,
        title: note.title,
        description: note.description
      })
    )
  }

  return (
    <Card sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Typography variant='h6' fontWeight={500}>
          {note.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {note.description}
        </Typography>
      </CardContent>
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center', pr: 2 }}>
        <IconButton size='small' color='primary' onClick={handleUpdate}>
          <Pencil />
        </IconButton>
        <IconButton size='small' color='error' onClick={handleDeleteNote}>
          <Trash />
        </IconButton>
      </Stack>
    </Card>
  )
}
