import { Note } from './note'
import { User } from './user'

export type NoteBoardProps = {
  user: User
  notes: Note[]
  addNote: (note: { title: string; description: string; userId: number }) => Promise<void>
  updateNote: (id: number, note: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  canCreate?: boolean
  canUpdate?: (note: Note) => boolean
  canDelete?: boolean
  loading: boolean
}
