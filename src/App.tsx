import { CssBaseline, Container, Stack, Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import PaymentCard from './components/PaymentCard'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: '100dvh',
          minWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            component="img"
            src="/crosspay-solutions-logo-color.svg"
            alt="Crosspay Solutions"
            sx={{ height: 40, width: 'auto' }}
          />
          <PaymentCard />
        </Stack>
      </Container>
    </ThemeProvider>
  )
}
