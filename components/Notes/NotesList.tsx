'use client'
import { Box } from '@mui/material'
import NoteItem from './NoteItem'
import { useAppSelector } from '@/@core/hooks/redux'
import { useParams } from 'next/navigation'

export default function NotesList() {
  const params = useParams() as { sectionId: string }
  const sectionId = Number(params.sectionId)

  const notes = useAppSelector(state => state.notes.notes)
  const sectionNotes = notes.filter(n => n.sectionId === sectionId)

  return (
    <Box>
      {sectionNotes.length > 0 ? (
        sectionNotes.map(note => <NoteItem key={note.id} note={note} />)
      ) : (
        <p>No notes in this section</p>
      )}
    </Box>
  )
}
