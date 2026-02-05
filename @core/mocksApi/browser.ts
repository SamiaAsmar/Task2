import { handlers } from './handlers'
export const initWorker = async () => {
  if (typeof window === 'undefined') return null
  const { setupWorker } = await import('msw/browser')
  const worker = setupWorker(...handlers)
  await worker.start()
  return worker
}
