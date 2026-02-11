'use client'

import { IconButton } from '@mui/material'
import { ChevronRight, Pencil, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/@core/hooks/redux'
import { deleteProject, openEditDialog } from '@/app/features/projects/projectSlice'
import toast from 'react-hot-toast'

export default function ProjectActions({ projectId }: { projectId: number }) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    dispatch(deleteProject(projectId))
    toast.success('Project deleted')
  }

  const handleUpdate = () => {
    dispatch(openEditDialog(projectId))
  }

  return (
    <div>
      <IconButton color='primary' onClick={handleUpdate}>
        <Pencil />
      </IconButton>

      <IconButton color='error' onClick={handleDelete}>
        <Trash />
      </IconButton>

      <IconButton onClick={() => router.push(`/projects/${projectId}`)}>
        <ChevronRight />
      </IconButton>
    </div>
  )
}
