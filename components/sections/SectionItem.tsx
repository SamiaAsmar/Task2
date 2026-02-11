'use client'
import { Card, CardContent, IconButton, Stack } from '@mui/material'
import { ChevronRight, Pencil, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/@core/hooks/redux'
import { deleteSection, openEditDialog } from '@/app/features/sections/sectionSlice'

type Props = {
  section: { id: number; name: string }
  projectId: number
}

export default function SectionItem({ section, projectId }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    dispatch(deleteSection(section.id))
  }

  const handleEdit = () => {
    dispatch(openEditDialog(section.id))
  }

  const navigateToSection = () => {
    router.push(`/projects/${projectId}/sections/${section.id}`)
  }

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <CardContent>{section.name}</CardContent>
      <Stack direction='row' spacing={1} alignItems='center'>
        <IconButton onClick={handleEdit}>
          <Pencil />
        </IconButton>
        <IconButton color='error' onClick={handleDelete}>
          <Trash />
        </IconButton>
        <IconButton size='small' onClick={navigateToSection}>
          <ChevronRight />
        </IconButton>
      </Stack>
    </Card>
  )
}
