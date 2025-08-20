import { createTheme } from '@mui/material/styles'

export const COLORS = {
  bgMain: '#F7F7F7',
  bgSec: '#FFFFFF',
  btn1: '#5036F6',
  btn2: '#E937B1',
  textTitle: '#1E1A30',
  textParagraph: '#5E5E5E',
  chevron: '#999999',
  shadow: 'rgba(30, 26, 48, 0.1)',
}

const theme = createTheme({
  palette: {
    background: {
      default: COLORS.bgMain,
      paper: COLORS.bgSec,
    },
    primary: { main: COLORS.btn1 },
    secondary: { main: COLORS.btn2 },
    text: {
      primary: COLORS.textTitle,
      secondary: COLORS.textParagraph,
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    h4: { fontWeight: 700 },
    body2: { color: COLORS.textParagraph },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
          boxShadow: `0px 0px 15px ${COLORS.shadow}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: COLORS.bgMain,
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: 'transparent' },
          '&.Mui-focused fieldset': { borderColor: 'transparent' },
        },
        input: { padding: '0.9rem 1rem' },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: COLORS.chevron },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: '1.25rem',
          paddingBlock: '0.875rem',
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
})

export default theme
