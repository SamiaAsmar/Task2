'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initWorker } from '@/@core/mocksApi/browser'
import { SettingsProvider } from '@/@core/context/SettingsContext'
import ThemeComponent from '@/@core/theme/ThemeComponent'
import I18nProvider from '@/providers/I18nProvider'
import HydrationGate from '@/components/HydrationGate'
import { useSettings } from '@/@core/hooks/useSettings'
import Spinner from '@/components/loaders/Spinner'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import AuthProvider from './AuthProvider'

function ThemedProviders({ children, client }: { children: React.ReactNode; client: QueryClient }) {
  const { settings } = useSettings()
  return (
    <ThemeComponent settings={settings}>
      <QueryClientProvider client={client}>
        <I18nProvider>
          <HydrationGate fallback={<Spinner />}>{children}</HydrationGate>
        </I18nProvider>
      </QueryClientProvider>
    </ThemeComponent>
  )
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  const [workerReady, setWorkerReady] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initWorker().then(() => setWorkerReady(true))
    } else {
      setWorkerReady(true)
    }
  }, [])

  if (!workerReady) return <Spinner />

  return (
    <Provider store={store}>
      <AuthProvider>
        <SettingsProvider>
          <ThemedProviders client={client}>{children}</ThemedProviders>
        </SettingsProvider>
      </AuthProvider>
    </Provider>
  )
}
