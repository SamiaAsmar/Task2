'use client'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../app/features/auth/authSlice'
import projectsReducer from '../app/features/projects/projectSlice'
import sectionsReducer from '../app/features/sections/sectionSlice'
import noteReducer from '../app/features/notes/noteSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    sections: sectionsReducer,
    notes: noteReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
