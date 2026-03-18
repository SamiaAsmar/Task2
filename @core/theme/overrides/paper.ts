import type { Theme } from '@mui/material/styles'

const PaperOverride = {
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundImage: 'none',
        marginTop: theme.spacing(8),
        padding: theme.spacing(4),
        borderRadius: theme.spacing(4)
      })
    }
  }
}

export default PaperOverride
