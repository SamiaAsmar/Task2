'use client'

import { RequirePermission } from '@/@core/middleware'
export default function AdminTestPage() {
  return (
    <RequirePermission requiredPermissions={['admin_access']}>
      <div style={{ padding: 24 }}>
        <h1>Admin Test Page</h1>
        <p>Only users with admin role can see this page.</p>
      </div>
    </RequirePermission>
  )
}
