import { authHandlers } from './handlers/auth'
import { notesHandlers } from './handlers/notes'

export const initWorker = async () => {
  if (typeof window === 'undefined') return null
  const { setupWorker } = await import('msw/browser')
  const worker = setupWorker(...authHandlers, ...notesHandlers)
  await worker.start()
  return worker
}
