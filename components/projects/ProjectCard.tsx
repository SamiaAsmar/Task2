'use client'

import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { useAppSelector } from '@/@core/hooks/redux'
import ProjectActions from './ProjectAction'

export default function ProjectCard({ projectId }: { projectId: number }) {
  const project = useAppSelector(state => state.projects.projects.find(p => p.id === projectId))

  if (!project) return null

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText primary={project.name} secondary={`Owner: ${project.owner}`} />

      <ProjectActions projectId={projectId} />
    </ListItem>
  )
}
