'use client'
import { Acl } from '../ACL'
import ProjectItem from './ProjectItem'
import { useAppSelector } from '@/@core/hooks/redux'

export default function ProjectList() {
  const { projects } = useAppSelector(state => state.projects)

  return (
    <>
      {projects.map(project => (
        <Acl key={project.id} permission={{ action: 'view', subject: 'projects' }} project={project}>
          <ProjectItem key={project.id} projectId={project.id} />
        </Acl>
      ))}
    </>
  )
}
