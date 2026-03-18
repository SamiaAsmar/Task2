'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { Note } from '@/@core/types/note'


export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/notes')
      setNotes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      const res = await axios.post('/api/notes', note)
      setNotes(prev => [...prev, res.data])
    } catch (err) {
      console.error(err)
    }
  }
  const updateNote = async (id: number, note: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    try {
      const res = await axios.put(`/api/notes/${id}`, note)
      setNotes(prev => prev.map(n => (n.id === id ? res.data : n)))
    } catch (err) {
      console.error(err)
    }
  }
  const deleteNote = async (id: number) => {
    try {
      await axios.delete(`/api/notes/${id}`)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <NotesContext.Provider value={{ notes, loading, fetchNotes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => {
  const context = useContext(NotesContext)
  if (!context) throw new Error('useNotes must be used within NotesProvider')
  return context
}
