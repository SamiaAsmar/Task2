import { http, HttpResponse } from 'msw'
import Users from '../../mock/Users.json'
import { User } from '@/@core/types/user'

let mockToken: string | null = null
let loggedInUser: User | null = null

export const authHandlers = [
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string; role: string }
    const { email, password, role } = body

    if (!email || !password || !role) {
      return HttpResponse.json({ message: 'Email and password required' }, { status: 400 })
    }

    const userByEmail = Users.find(u => u.email === email)
    if (!userByEmail) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    if (userByEmail.role !== role) {
      return HttpResponse.json({ message: `User is not authorized as ${role}` }, { status: 403 })
    }

    const user = Users.find(u => u.email === email && u.password === password && u.role)
    if (!user) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    mockToken = 'fake-jwt-token'
    loggedInUser = { id: user.id, name: user.name, email: user.email, role: user.role }

    return HttpResponse.json({
      token: mockToken,
      user: loggedInUser,
      setCookie: 'token=fake-jwt-token; path=/'
    })
  }),

  http.get('/api/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || token !== mockToken) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!loggedInUser) {
      return HttpResponse.json({ message: 'No user logged in' }, { status: 401 })
    }

    return HttpResponse.json(loggedInUser)
  })
]
