import { authHandlers } from './auth'
import { notesHandlers } from './notes'
import { projectHandlers } from './projects'
import { sectionHandlers } from './sections'
export const handlers = [...authHandlers, ...notesHandlers, ...projectHandlers, ...sectionHandlers]
