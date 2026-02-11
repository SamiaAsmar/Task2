'use client'

import { List, Typography } from '@mui/material'
import { useAppSelector } from '@/@core/hooks/redux'
import { selectAllProjects } from '@/app/features/projects/projectSlice'
import ProjectCard from './ProjectCard'
import { Acl } from '../ACL'

export default function ProjectsDetails() {
  const projects = useAppSelector(selectAllProjects)
  const user = useAppSelector(state => state.auth.user)

  if (!user) return <Typography>Loading user...</Typography>

  return (
    <List>
      {projects.map(p => (
        <Acl key={p.id} permission={{ action: 'view', subject: 'projects' }} project={p}>
          <ProjectCard projectId={p.id} />
        </Acl>
      ))}
    </List>
  )
}
