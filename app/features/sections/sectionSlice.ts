import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Section } from '@/@core/types/section'

type SectionsState = {
  sections: Section[]
  selectedSection: Section | null
  loading: boolean
  error: string | null
  editingSectionId: number | null
  editDialogOpen: boolean
}

const initialState: SectionsState = {
  sections: [],
  selectedSection: null,
  loading: false,
  error: null,
  editingSectionId: null,
  editDialogOpen: false
}

export const fetchSections = createAsyncThunk('sections/fetchSections', async (projectId: number) => {
  const res = await axios.get(`/api/projects/${projectId}/sections`)
  return res.data as Section[]
})

export const fetchSectionById = createAsyncThunk('sections/fetchSectionById', async (sectionId: number) => {
  const res = await axios.get(`/api/sections/${sectionId}`)
  return res.data as Section
})

export const createSection = createAsyncThunk(
  'sections/createSection',
  async ({ projectId, data }: { projectId: number; data: Partial<Section> }) => {
    const res = await axios.post(`/api/projects/${projectId}/sections`, data)
    return res.data as Section
  }
)

export const updateSection = createAsyncThunk(
  'sections/updateSection',
  async ({ id, data }: { id: number; data: Partial<Section> }) => {
    const res = await axios.put(`/api/sections/${id}`, data)
    return res.data as Section
  }
)

export const deleteSection = createAsyncThunk('sections/deleteSection', async (id: number) => {
  await axios.delete(`/api/sections/${id}`)
  return id
})

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    clearSelectedSection: state => {
      state.selectedSection = null
    },
    openEditDialog: (state, action: PayloadAction<number>) => {
      state.editingSectionId = action.payload
      state.editDialogOpen = true
    },

    closeEditDialog: state => {
      state.editDialogOpen = false
      state.editingSectionId = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSections.pending, state => {
        state.loading = true
      })
      .addCase(fetchSections.fulfilled, (state, action: PayloadAction<Section[]>) => {
        state.loading = false
        state.sections = action.payload
      })
      .addCase(fetchSections.rejected, state => {
        state.loading = false
        state.error = 'Failed to fetch sections'
      })

      .addCase(fetchSectionById.fulfilled, (state, action) => {
        state.selectedSection = action.payload
      })

      .addCase(createSection.fulfilled, (state, action) => {
        state.sections.push(action.payload)
      })

      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(s => s.id === action.payload.id)
        if (index !== -1) state.sections[index] = action.payload
      })

      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter(s => s.id !== action.payload)
      })
  }
})

export const { clearSelectedSection, openEditDialog, closeEditDialog } = sectionsSlice.actions
export default sectionsSlice.reducer
export const selectSections = (state: { sections: SectionsState }) => state.sections.sections
export const selectSectionLoading = (state: { sections: SectionsState }) => state.sections.loading
export const selectSelectedSection = (state: { sections: SectionsState }) => state.sections.selectedSection
export const selectEditDialogOpen = (state: { sections: SectionsState }) => state.sections.editDialogOpen
