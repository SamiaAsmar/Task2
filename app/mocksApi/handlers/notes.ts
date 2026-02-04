import { http, HttpResponse } from 'msw'
import Notes from '../../mock/Notes.json'
import {Note} from '../../types/note'

export const notesHandlers = [
  http.get('/api/notes', () => HttpResponse.json(Notes, { status: 200 })),
  http.post('/api/notes', async ({request}) => {
  const newNote = await request.json() as Omit<Note, 'id' | 'createdAt'>;
  const nextId = Notes.length ? Math.max(...Notes.map(n => n.id)) + 1 : 1;
  const noteToAdd = { id: nextId, createdAt: new Date().toISOString(), ...newNote };
  Notes.push(noteToAdd);
  return HttpResponse.json(noteToAdd, { status: 201 });
}),
  http.put('/api/notes/:id', async ({params, request}) => {
    const noteId = Number(params.id);
    const index = Notes.findIndex(n => n.id === noteId);
    if(index === -1){
      return HttpResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    const updateNote = (await request.json()) as Partial<Omit<Note, 'id' | 'createdAt'>>;
    Notes[index] = { ...Notes[index], ...updateNote};
    return HttpResponse.json(Notes[index]);
  }),
  http.delete('/api/notes/:id', async ({params}) => {
    const noteId = Number(params.id);
    const index = Notes.findIndex(n => n.id === noteId);
    if(index === -1){
      return HttpResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    Notes.splice(index, 1);
    return HttpResponse.json({ message: 'Deleted successfully' })
  }),
]
