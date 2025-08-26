import * as React from 'react'
import {
  Box,
  Typography,
  Divider,
  Stack,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import Sidebar from '../components/sidebar'
import { COLORS } from '../theme'

type CurrencyRow = {
  label: string
  code: 'COP' | 'MXN' | 'CLP' | 'ARS' | 'USD'
  provider: 'Vita Wallet' | 'OnePay'
}

const initialRows: CurrencyRow[] = [
  { label: 'Peso Colombiano', code: 'COP', provider: 'Vita Wallet' },
  { label: 'Peso Mexicano',  code: 'MXN', provider: 'Vita Wallet' },
  { label: 'Peso Chileno',   code: 'CLP', provider: 'OnePay' },
  { label: 'Peso Argentino', code: 'ARS', provider: 'Vita Wallet' },
  { label: 'Dólar Americano',code: 'USD', provider: 'OnePay' },
]

export default function Configuracion() {
  const [rows, setRows] = React.useState<CurrencyRow[]>(initialRows)

  const handleChange = (idx: number, value: CurrencyRow['provider']) => {
    const copy = [...rows]
    copy[idx] = { ...copy[idx], provider: value }
    setRows(copy)
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: COLORS.bgMain, minHeight: '100vh' }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1 }}>
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
            Selecciona el proveedor para cada divisa y haz clic en guardar.
          </Typography>

          {/* Encabezados tabla */}
          <Stack direction="row" spacing={2} sx={{ mb: 1.5 }} alignItems="center">
            <Typography sx={{ width: 360, fontWeight: 700, color: COLORS.text }}>
              Divisa
            </Typography>
            <Typography sx={{ flex: 1, fontWeight: 700, color: COLORS.text }}>
              Proveedor
            </Typography>
          </Stack>

          {/* Filas */}
          <Stack spacing={1.25}>
            {rows.map((r, idx) => (
              <Stack key={r.code} direction="row" spacing={2} alignItems="center">
                {/* Campo Divisa (gris, estilo disabled) */}
                <Box
                  sx={{
                    width: 360,
                    bgcolor: '#F4F4F6',
                    borderRadius: 1,
                    px: 2,
                    py: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #ECECEC',
                  }}
                >
                  <Typography sx={{ color: COLORS.text }}>{r.label}</Typography>
                  <Chip
                    label={r.code}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor: '#EBEBF0',
                      color: COLORS.text,
                      borderRadius: 1,
                    }}
                  />
                </Box>

                {/* Select Proveedor */}
                <Select
                  fullWidth
                  size="small"
                  value={r.provider}
                  onChange={(e) => handleChange(idx, e.target.value as CurrencyRow['provider'])}
                  sx={{
                    flex: 1,
                    bgcolor: '#F4F4F6',
                    borderRadius: 1,
                    '& .MuiSelect-select': { py: 1.25 },
                  }}
                >
                  <MenuItem value="Vita Wallet">Vita Wallet</MenuItem>
                  <MenuItem value="OnePay">OnePay</MenuItem>
                </Select>
              </Stack>
            ))}
          </Stack>

          {/* Botones */}
          <Stack direction="row" spacing={2} sx={{ pt: 3 }}>
            {/* Botón gris con check */}
            <Button
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#ECECEC',
                color: '#111',
                borderRadius: 999,
                px: 2,
                '&:hover': { bgcolor: '#E3E3E3' },
                gap: 1,
              }}
              endIcon={
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: '#111',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 16 }} />
                </Box>
              }
              onClick={() => {}}
            >
              Guardar Selección
            </Button>

            {/* Botón morado degradado con check */}
            <Button
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 999,
                px: 2,
                background: 'linear-gradient(90deg, #5036F6 0%, #E937B1 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4b30ee 0%, #e02ea9 100%)',
                },
                gap: 1,
              }}
              endIcon={
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    color: '#6B2BFF',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 16 }} />
                </Box>
              }
              onClick={() => {}}
            >
              Guardar Selección
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
