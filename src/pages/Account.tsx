import * as React from 'react'
import {
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Switch,
} from '@mui/material'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import Sidebar from '../components/sidebar'
import { COLORS } from '../theme'

export default function Cuenta() {
  const [showPwd, setShowPwd] = React.useState(false)
  const [email, setEmail] = React.useState('minombre@crosspaysolutions.com')
  const [password, setPassword] = React.useState('2@_%kJi/*.#eC5%leWQ5S8$')
  const [twoFA, setTwoFA] = React.useState(false)

  const isEmailValid = React.useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  )
  const isComplete = React.useMemo(
    () => isEmailValid && password.trim().length > 0,
    [isEmailValid, password]
  )

  const endIcon = (
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        bgcolor: isComplete ? '#fff' : '#111',
        color: isComplete ? '#6B2BFF' : '#fff',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <CheckRoundedIcon sx={{ fontSize: 16 }} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', bgcolor: COLORS.bgMain, p: 0, minHeight: '100vh' }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1, pr: 6 }}>
        {/* Header */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Typography variant="h5" fontWeight={800} color={COLORS.text} sx={{ mb: 1 }}>
            Configuración de pasarelas de recaudo por divisa
          </Typography>
          <Divider />
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, pt: 3, maxWidth: 720 }}>
          <Typography sx={{ mb: 3, color: COLORS.text, opacity: 0.9 }}>
            Para hacer cambios, selecciona el campo, digite la información y haz clic en guardar.
          </Typography>

          <Stack spacing={2.5}>
            {/* Nombre de usuario (deshabilitado) */}
            <Box>
              <Typography sx={{ mb: 0.75, fontWeight: 600 }}>Nombre de usuario</Typography>
              <TextField fullWidth size="medium" value="William Cárdenas Bohórquez" disabled />
            </Box>

            {/* Email de recuperación */}
            <Box>
              <Typography sx={{ mb: 0.75, fontWeight: 600 }}>Email de recuperación</Typography>
              <TextField
                fullWidth
                size="medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@dominio.com"
                error={email.length > 0 && !isEmailValid}
                helperText={email.length > 0 && !isEmailValid ? 'Correo electrónico inválido' : ' '}
              />
            </Box>

            {/* Contraseña con ícono para mostrar/ocultar */}
            <Box>
              <Typography sx={{ mb: 0.75, fontWeight: 600 }}>Contraseña</Typography>
              <TextField
                fullWidth
                size="medium"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPwd((s) => !s)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPwd ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Configurar 2FA (campo visual + switch al final) */}
            <Box>
              <Typography sx={{ mb: 0.75, fontWeight: 600 }}>Configurar 2FA</Typography>
              <TextField
                fullWidth
                size="medium"
                value="Activar Código Email"
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Switch
                        size="small"
                        checked={twoFA}
                        onChange={(e) => setTwoFA(e.target.checked)}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Botón Guardar (gris si incompleto, gradiente si completo) */}
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 999,
                  px: 2,
                  gap: 1,
                  ...(isComplete
                    ? {
                        color: '#fff',
                        background: 'linear-gradient(90deg, #5036F6 0%, #E937B1 100%)',
                        '&:hover': {
                          background:
                            'linear-gradient(90deg, #4b30ee 0%, #e02ea9 100%)',
                        },
                      }
                    : {
                        bgcolor: '#ECECEC',
                        color: '#111',
                        '&:hover': { bgcolor: '#E3E3E3' },
                      }),
                }}
                endIcon={endIcon}
                onClick={() => {
                  if (!isComplete) return
                  // TODO: lógica de guardado (API/mutación)
                  // console.log({ email, password, twoFA })
                }}
              >
                Guardar Selección
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
