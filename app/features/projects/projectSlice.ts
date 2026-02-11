import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Project } from '@/@core/types/project'

type ProjectsState = {
  projects: Project[]
  loading: boolean
  error: string | null
  selectedProjectId: number | null
  editingProjectId: number | null
  editDialogOpen: boolean
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
  selectedProjectId: null,
  editingProjectId: null,
  editDialogOpen: false
}

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const res = await axios.get('/api/projects')
  return res.data as Project[]
})

export const addProject = createAsyncThunk('projects/addProject', async (project: Partial<Project>) => {
  const res = await axios.post('/api/projects', project)
  return res.data as Project
})

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }: { id: number; data: Partial<Project> }) => {
    const res = await axios.put(`/api/projects/${id}`, data)
    return res.data as Project
  }
)

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id: number) => {
  await axios.delete(`/api/projects/${id}`)
  return id
})

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    selectProject(state, action: PayloadAction<number>) {
      state.selectedProjectId = action.payload
    },
    openEditDialog: (state, action) => {
      state.editingProjectId = action.payload
      state.editDialogOpen = true
    },
    closeEditDialog: state => {
      state.editDialogOpen = false
      state.editingProjectId = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.loading = true
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.projects = action.payload
        state.loading = false
      })
      .addCase(fetchProjects.rejected, state => {
        state.loading = false
        state.error = 'Failed to fetch projects'
      })
      .addCase(addProject.pending, state => {
        state.loading = true
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload)
        state.loading = false
      })
      .addCase(addProject.rejected, state => {
        state.loading = false
        state.error = 'Failed to add project'
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload)
      })
  }
})

export const { selectProject, openEditDialog, closeEditDialog } = projectsSlice.actions

export const selectAllProjects = (state: { projects: ProjectsState }) => state.projects.projects
export const selectLoading = (state: { projects: ProjectsState }) => state.projects.loading
export const selectSelectedProjectId = (state: { projects: ProjectsState }) => state.projects.selectedProjectId
export const selectEditingProjectId = (state: { projects: ProjectsState }) => state.projects.editingProjectId
export const selectEditDialogOpen = (state: { projects: ProjectsState }) => state.projects.editDialogOpen

export default projectsSlice.reducer
