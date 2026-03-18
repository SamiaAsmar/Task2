'use client'
import { ListItemButton, ListItemText } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/@core/hooks/redux'
import { selectProject } from '../../app/features/projects/projectSlice'

type Props = {
  projectId: number
}

export default function ProjectItem({ projectId }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const project = useAppSelector(state => state.projects.projects.find(p => p.id === projectId))
  const selectedProjectId = useAppSelector(state => state.projects.selectedProjectId)

  if (!project) return null

  return (
    <ListItemButton
      selected={selectedProjectId === project.id}
      onClick={() => {
        dispatch(selectProject(project.id))
        router.push(`/projects/${project.id}`)
      }}
    >
      <ListItemText primary={project.name} />
    </ListItemButton>
  )
}
