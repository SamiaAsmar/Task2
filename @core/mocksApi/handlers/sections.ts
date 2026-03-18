import { http, HttpResponse } from 'msw'
import mockData from '../../mock/mockData.json'
import { Section } from '@/@core/types/section'

export const sectionHandlers = [
  http.get('/api/sections/:id', ({ params }) => {
    const sectionId = Number(params.id)
    let foundSection: Section | undefined = undefined

    for (const project of mockData.projects) {
      const section = project.sections.find(s => s.id === sectionId)
      if (section) {
        foundSection = section
        break
      }
    }

    if (!foundSection) {
      return HttpResponse.json({ message: 'Section not found' }, { status: 404 })
    }
    return HttpResponse.json(foundSection, { status: 200 })
  }),
  http.put('/api/sections/:id', async ({ params, request }) => {
    const sectionId = Number(params.id)

    const updatedData = (await request.json()) as Partial<Section>

    let foundSection: Section | undefined = undefined

    for (const project of mockData.projects) {
      const index = project.sections.findIndex(s => s.id === sectionId)
      if (index !== -1) {
        project.sections[index] = {
          ...project.sections[index],
          ...updatedData
        }

        foundSection = project.sections[index]
        break
      }
    }

    if (!foundSection) {
      return HttpResponse.json({ message: 'Section not found' }, { status: 404 })
    }

    return HttpResponse.json(foundSection, { status: 200 })
  }),

  http.delete('/api/sections/:id', async ({ params }) => {
    const sectionId = Number(params.id)

    let found = false

    for (const project of mockData.projects) {
      const sectionIndex = project.sections.findIndex(s => s.id === sectionId)
      if (sectionIndex !== -1) {
        project.sections.splice(sectionIndex, 1)
        found = true
        break
      }
    }

    if (!found) {
      return HttpResponse.json({ message: 'Section not found' }, { status: 404 })
    }

    return HttpResponse.json({ message: 'Section deleted successfully' }, { status: 200 })
  }),
  http.get('/api/projects/:id/sections', ({ params }) => {
    const projectId = Number(params.id)
    const project = mockData.projects.find(p => p.id === projectId)

    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    return HttpResponse.json(project.sections, { status: 200 })
  }),

  http.post('/api/projects/:id/sections', async ({ request, params }) => {
    const projectId = Number(params.id)
    const project = mockData.projects.find(p => p.id === projectId)

    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    const newSection = (await request.json()) as Partial<Section>

    const allSectionIds = mockData.projects.flatMap(p => p.sections.map(s => s.id))

    const newId = allSectionIds.length > 0 ? Math.max(...allSectionIds) + 1 : 1

    const sectionToAdd: Section = {
      id: newId,
      name: newSection.name || `Section ${newId}`,
      notes: newSection.notes || []
    }

    project.sections.push(sectionToAdd)

    return HttpResponse.json(sectionToAdd, { status: 201 })
  })
]
