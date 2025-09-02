// App.tsx
import * as React from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'

import { Routes, Route } from 'react-router-dom'

import PaymentCard from './pages/PaymentCard'
import Dashboard from './pages/Dashboard'
import Cuenta from './pages/Account'
import Configuracion from './pages/Settings'


export default function App() {
  // soportar ?token=... una vez
  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (t) {
      localStorage.setItem('adminToken', t)
      localStorage.setItem('token', t)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Pública */}
        <Route path="/" element={<PaymentCard />} />

        {/* Admin directo */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/configuracion" element={<Configuracion />} />

        <Route
          path="*"
          element={<div style={{ padding: 24 }}>404 • Página no encontrada</div>}
        />
      </Routes>
    </ThemeProvider>
  )
}
