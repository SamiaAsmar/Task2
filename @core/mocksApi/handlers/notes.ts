import { http, HttpResponse } from 'msw'
import { Note } from '@/@core/types/note'
import mockData from '../../mock/mockData.json'

const Notes: Note[] = mockData.projects
  .flatMap(p => p.sections)
  .flatMap(s => s.notes.map(n => ({ ...n, sectionId: s.id })))

export const notesHandlers = [
  http.get('/api/notes', () => {
    return HttpResponse.json(Notes, { status: 200 })
  }),

  http.get('/api/sections/:id/notes', ({ params }) => {
    const sectionId = Number(params.id)
    const sectionNotes = Notes.filter(n => n.sectionId === sectionId)

    return HttpResponse.json(sectionNotes, { status: 200 })
  }),

  http.post('/api/sections/:sectionId/notes', async ({ params, request }) => {
    const sectionId = Number(params.sectionId)
    const newNote = (await request.json()) as Omit<Note, 'id' | 'sectionId'>
    const nextId = Notes.length ? Math.max(...Notes.map(n => n.id)) + 1 : 301
    const noteToAdd: Note = { id: nextId, sectionId, ...newNote }
    Notes.push(noteToAdd)
    return HttpResponse.json(noteToAdd, { status: 201 })
  }),

  http.put('/api/notes/:id', async ({ params, request }) => {
    const noteId = Number(params.id)
    const index = Notes.findIndex(n => n.id === noteId)
    if (index === -1) return HttpResponse.json({ message: 'Note not found' }, { status: 404 })

    const updateNote = (await request.json()) as Partial<Omit<Note, 'id' | 'sectionId'>>
    Notes[index] = { ...Notes[index], ...updateNote }
    return HttpResponse.json(Notes[index], { status: 200 })
  }),

  http.delete('/api/notes/:id', ({ params }) => {
    const noteId = Number(params.id)
    const index = Notes.findIndex(n => n.id === noteId)
    if (index === -1) return HttpResponse.json({ message: 'Note not found' }, { status: 404 })

    Notes.splice(index, 1)
    return HttpResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  })
]
