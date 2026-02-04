'use client'

import NoteBoard from '@/components/NoteCard'
import { RequirePermission } from '@/@core/middleware'

export default function Page() {
  return (
    <RequirePermission requiredPermissions={['create_note', 'update_note']}>
      <NoteBoard />
    </RequirePermission>
  )
}
