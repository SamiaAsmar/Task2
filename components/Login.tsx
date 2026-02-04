'use client'

import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack
} from '@mui/material'
import { useAuth } from '@/@core/context/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Home } from 'lucide-react' // Lucide home icon
import { Lock } from 'lucide-react' // Lucide lock icon

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
    role: ''
  })
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [name!]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(form.email, form.password, form.role)
      toast.success('Login Success')
      router.push('/firstPage')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string })?.message || 'Login failed'
        toast.error(message)
      } else {
        toast.error('Unexpected error')
      }
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />

      <Stack direction='row' justifyContent='center' sx={{ mt: 2 }}>
        <Button onClick={() => router.push('/')} color='primary' variant='contained' endIcon={<Home size={16} />}>
          Back to Notes
        </Button>
      </Stack>

      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <Lock />
        </Avatar>

        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>

        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={form.password}
            onChange={handleChange}
          />

          <FormControl fullWidth margin='normal'>
            <InputLabel id='role-label'>Role</InputLabel>
            <Select
              labelId='role-label'
              id='role'
              name='role'
              value={form.role}
              label='Role'
              onChange={handleChange}
              required
            >
              <MenuItem value=''>Select Role</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='member'>Member</MenuItem>
            </Select>
          </FormControl>

          <Button type='submit' fullWidth variant='contained' sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Box>
      </Paper>

      <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 5 }}>
        © {new Date().getFullYear()} Your App
      </Typography>
    </Container>
  )
}
