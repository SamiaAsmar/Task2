import { http, HttpResponse } from 'msw'
import mockData from '../../mock/mockData.json'
import { Project } from '@/@core/types/project'

export const projectHandlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json(mockData.projects, { status: 200 })
  }),

  http.post('/api/projects', async ({ request }) => {
    const newProject = (await request.json()) as Project

    const newId = mockData.projects.length > 0 ? Math.max(...mockData.projects.map(p => p.id)) + 1 : 1

    const projectToAdd: Project = {
      id: newId,
      name: newProject.name,
      owner: newProject.owner,
      description: newProject.description,
      sections: []
    }

    mockData.projects.push(projectToAdd)

    return HttpResponse.json(projectToAdd, { status: 201 })
  }),

  http.get('/api/projects/:id', ({ params }) => {
    const projectId = Number(params.id)
    const project = mockData.projects.find(p => p.id === projectId)

    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    return HttpResponse.json(project, { status: 200 })
  }),

  http.put('/api/projects/:id', async ({ params, request }) => {
    const projectId = Number(params.id)
    const updatedData = (await request.json()) as Partial<Project>

    const projectIndex = mockData.projects.findIndex(p => p.id === projectId)

    if (projectIndex === -1) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    const project = mockData.projects[projectIndex]
    mockData.projects[projectIndex] = { ...project, ...updatedData }

    return HttpResponse.json(mockData.projects[projectIndex], { status: 200 })
  }),

  http.delete('/api/projects/:id', ({ params }) => {
    const projectId = Number(params.id)
    const projectIndex = mockData.projects.findIndex(p => p.id === projectId)

    if (projectIndex === -1) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    mockData.projects.splice(projectIndex, 1)

    return HttpResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  })
]
