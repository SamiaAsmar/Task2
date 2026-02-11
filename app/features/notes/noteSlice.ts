import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Note } from '@/@core/types/note'

type NotesState = {
  notes: Note[]
  loading: boolean
  error: string | null
  editingNote: Note | null
  editDialogOpen: boolean
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  editingNote: null,
  editDialogOpen: false
}

export const fetchNotesBySection = createAsyncThunk('notes/fetchBySection', async (sectionId: number) => {
  const res = await axios.get<Note[]>(`/api/sections/${sectionId}/notes`) // Fixed
  return res.data.map(note => ({
    ...note,
    sectionId
  }))
})

export const addNote = createAsyncThunk(
  'notes/add',
  async ({ sectionId, note }: { sectionId: number; note: Omit<Note, 'id' | 'sectionId'> }) => {
    const res = await axios.post<Note>(`/api/sections/${sectionId}/notes`, note) // Fixed
    return {
      ...res.data,
      sectionId
    }
  }
)

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, note }: { id: number; note: Partial<Omit<Note, 'id' | 'sectionId'>> }) => {
    const res = await axios.put<Note>(`/api/notes/${id}`, note)
    return res.data
  }
)

export const deleteNote = createAsyncThunk('notes/delete', async (id: number) => {
  await axios.delete(`/api/notes/${id}`)
  return id
})

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotes(state) {
      state.notes = []
      state.error = null
      state.loading = false
    },
    openEditDialog: (state, action: PayloadAction<{ noteId: number; title: string; description: string }>) => {
      const note = state.notes.find(n => n.id === action.payload.noteId)
      if (note) {
        state.editingNote = note
        state.editDialogOpen = true
      }
    },
    closeEditDialog: state => {
      state.editDialogOpen = false
      state.editingNote = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotesBySection.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotesBySection.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.notes = action.payload
        state.loading = false
      })
      .addCase(fetchNotesBySection.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch notes'
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.notes.push(action.payload)
      })
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<Note>) => {
        const index = state.notes.findIndex(n => n.id === action.payload.id)
        if (index !== -1) {
          state.notes[index] = action.payload
        }
      })
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<number>) => {
        state.notes = state.notes.filter(n => n.id !== action.payload)
      })
  }
})

export const { clearNotes, openEditDialog, closeEditDialog } = noteSlice.actions
export default noteSlice.reducer
export const selectEditingProjectId = (state: { notes: NotesState }) => state.notes.editingNote
export const selectEditDialogOpen = (state: { notes: NotesState }) => state.notes.editDialogOpen
