// App.tsx
import * as React from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'

import { Routes, Route, Navigate } from 'react-router-dom'

import PaymentCard from './pages/PaymentCard'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/Login' 

const getAuthToken = () =>
  localStorage.getItem('adminToken') || localStorage.getItem('token') || ''

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getAuthToken()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  // soportar ?token=... una vez
  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (t) {
      localStorage.setItem('adminToken', t)
      localStorage.setItem('token', t)
    }
  }, [])

  const token = getAuthToken()
  const defaultRoute = token ? '/admin' : '/login'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Pública */}
        <Route path="/payment" element={<PaymentCard />} />

        {/* Login admin */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin
                onSuccess={() => {
                  window.location.replace('/admin')
                }}
              />
            )
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to={defaultRoute} replace />} />

        <Route path="*" element={<div style={{ padding: 24 }}>404 • Página no encontrada</div>} />
      </Routes>
    </ThemeProvider>
  )
}
