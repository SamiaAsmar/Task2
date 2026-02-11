'use client'
import { Permission, ROLE_PERMISSIONS } from '@/@core/types/permissions'
import { User } from '@/@core/types/user'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  permissions: Permission[]
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  permissions: []
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }: { email: string; password: string; role: string }) => {
    const res = await axios.post('/api/login', { email, password, role })
    const { token, user } = res.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    document.cookie = `token=${token}; path=/`
    document.cookie = `role=${user.role}; path=/`

    return { token, user }
  }
)

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!storedToken || !storedUser) return { token: null, user: null }

  return { token: storedToken, user: JSON.parse(storedUser) }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.permissions = []
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.permissions = [...(ROLE_PERMISSIONS[action.payload.user.role as keyof typeof ROLE_PERMISSIONS] || [])]
        state.loading = false
      })
      .addCase(login.rejected, state => {
        state.loading = false
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<{ token: string | null; user: User | null }>) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.permissions = action.payload.user
          ? [...(ROLE_PERMISSIONS[action.payload.user.role as keyof typeof ROLE_PERMISSIONS] || [])]
          : []
        state.loading = false
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
