'use client'
import React from 'react'
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'

type User = { id: number; name: string }
type Note = { id?: number; title: string; description: string; userId: number }
type Section = { id?: number; name: string; notes: Note[] }
type ProjectFormValues = {
  name: string
  description: string
  owner: string
  sections: Section[]
}

type AddProjectDialogProps = {
  open: boolean
  onClose: () => void
  onAdd: (project: ProjectFormValues & { id: number }) => void
  users: User[]
}

type SectionFieldProps = {
  sectionIndex: number
  removeSection: (index: number) => void
  control: Control<ProjectFormValues>
  users: User[]
}

function SectionField({ sectionIndex, removeSection, control, users }: SectionFieldProps) {
  const {
    fields: notes,
    append: appendNote,
    remove: removeNote
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.notes` as const
  })

  return (
    <Box>
      <Stack alignItems='center' spacing={1}>
        <Controller
          name={`sections.${sectionIndex}.name` as const}
          control={control}
          render={({ field }) => <TextField label='Section Name' {...field} fullWidth />}
        />
        <IconButton onClick={() => removeSection(sectionIndex)}>
          <Delete />
        </IconButton>
      </Stack>

      <Box mt={1}>
        <Typography variant='subtitle1'>Notes</Typography>
        {notes.map((note, noteIndex) => (
          <Stack key={note.id} direction='row' spacing={1} mt={1} alignItems='center'>
            <Controller
              name={`sections.${sectionIndex}.notes.${noteIndex}.title` as const}
              control={control}
              render={({ field }) => <TextField label='Title' {...field} />}
            />
            <Controller
              name={`sections.${sectionIndex}.notes.${noteIndex}.description` as const}
              control={control}
              render={({ field }) => <TextField label='Description' {...field} />}
            />
            <IconButton onClick={() => removeNote(noteIndex)}>
              <Delete />
            </IconButton>
          </Stack>
        ))}

        <Button
          startIcon={<Add />}
          size='small'
          onClick={() => appendNote({ title: '', description: '', userId: users[0]?.id || 1 })}
        >
          Add Note
        </Button>
      </Box>
    </Box>
  )
}

export default function AddProjectDialog({ open, onClose, onAdd, users }: AddProjectDialogProps) {
  const { control, handleSubmit, reset } = useForm<ProjectFormValues>({
    defaultValues: { name: '', description: '', owner: '', sections: [] }
  })

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection
  } = useFieldArray({
    control,
    name: 'sections' as const
  })

  const onSubmit = (data: ProjectFormValues) => {
    const projectWithIds = {
      id: Date.now(),
      ...data,
      sections: data.sections.map(section => ({
        ...section,
        id: Date.now() + Math.random(),
        notes: section.notes.map(note => ({ ...note, id: Date.now() + Math.random() }))
      }))
    }
    onAdd(projectWithIds)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Add New Project</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack direction='column' spacing={2}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => <TextField label='Project Name' {...field} fullWidth />}
            />
            <Controller
              name='description'
              control={control}
              render={({ field }) => <TextField label='Description' {...field} fullWidth multiline />}
            />

            <Controller
              name='owner'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Owner</InputLabel>
                  <Select {...field} label='Owner'>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.name}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Stack spacing={2} mt={2}>
              <Button startIcon={<Add />} sx={{ mt: 2 }} onClick={() => appendSection({ name: '', notes: [] })}>
                Add Section
              </Button>
              <Typography variant='h6'>Sections</Typography>
              {sections.map((section, index) => (
                <SectionField
                  key={section.id}
                  sectionIndex={index}
                  removeSection={removeSection}
                  control={control}
                  users={users}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' variant='contained'>
            Add Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
