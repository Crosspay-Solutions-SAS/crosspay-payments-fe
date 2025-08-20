import * as React from 'react'
import {
  Box, Paper, Typography, Stack, TextField, Select, MenuItem,
  FormControl, InputLabel, Checkbox, FormControlLabel, Button,
  Divider, InputAdornment
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'

const providers = [
  'Bancolombia',
  'Pagos PSE',
  'Nequi',
  'Daviplata',
  'Bancolombia BNPL',
  'Tarjetas de Crédito/Débito',
]

const GRADIENT = 'linear-gradient(90deg, #5036F6 0%, #E937B1 100%)'

const formatCOP = (n: number) =>
  `COP ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
    .format(n).replace('$', '$ ')}`

export default function PaymentCard() {
  const [provider, setProvider] = React.useState<string>('Bancolombia')
  const [terms, setTerms] = React.useState(false)
  const [amountRaw, setAmountRaw] = React.useState<string>('100000')
  const [amountDisplay, setAmountDisplay] = React.useState<string>(formatCOP(100000))

  const handleAmountChange = (val: string) => {
    const cleaned = val.replace(/[^\d]/g, '')
    setAmountRaw(cleaned)
  }

  const commitAmount = () => {
    const num = Number(amountRaw || '0')
    setAmountDisplay(formatCOP(num))
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, width: 420, maxWidth: '100%', mx: 'auto' }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" textAlign="center" fontWeight={800} sx={{ mb: 0.5 }}>
            Pago a Crosspay
          </Typography>
          <Typography variant="body2" textAlign="center">
            Verifica que la información esté correcta para proceder con el pago.
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <Box textAlign="center">
          <Typography variant="body2" sx={{ mb: 0.75 }}>
            Monto de la transacción
          </Typography>
          <TextField
            fullWidth
            value={amountRaw}
            onChange={(e) => handleAmountChange(e.target.value)}
            onBlur={commitAmount}
            placeholder="100000"
            inputProps={{ inputMode: 'numeric' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">COP $</InputAdornment>,
              sx: {
                fontWeight: 800,
                fontSize: '1.4rem',
                textAlign: 'center',
                '& input': { textAlign: 'center', fontWeight: 800, color: '#45208C', fontSize: '1.4rem' },
              },
            }}
            sx={{ maxWidth: 300, mx: 'auto' }}
          />
          <Typography sx={{ mt: 0.75, fontWeight: 800, color: '#45208C' }}>
            {amountDisplay}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={800} sx={{ mb: 0.75, color: '#1e1a30' }}>
            Concepto
          </Typography>
          <TextField
            fullWidth
            placeholder="Pago de pruebas para recaudo con tarjeta."
            inputProps={{ 'aria-label': 'concepto' }}
          />
        </Box>

        <Box>
          <Typography fontWeight={800} variant="body2" sx={{ mb: 0.75, color: '#1e1a30' }}>
            Elige un proveedor de pago
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="provider-label" sx={{ display: 'none' }}>Proveedor</InputLabel>
            <Select
              labelId="provider-label"
              value={provider}
              onChange={(e) => setProvider(String(e.target.value))}
              IconComponent={ExpandMoreRoundedIcon}
              MenuProps={{ PaperProps: { sx: { borderRadius: 2 } } }}
            >
              {providers.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)} />}
          label={
            <Typography variant="body2">
              Acepto los <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>Términos y Condiciones</a> del servicio.
            </Typography>
          }
        />
        <Box
          aria-hidden
          sx={{
            position: 'relative',
            height: 110,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/cp-logo-gray.png"
            alt="CP watermark"
            sx={{ width: 140, height: 'auto' }}
          />
        </Box>
        <Button
          variant="contained"
          fullWidth
          disabled={!terms}
          sx={{
            background: GRADIENT,
            '&:hover': { background: GRADIENT, filter: 'brightness(0.95)' },
            color: '#fff',
            borderRadius: 999,
            py: 1.2,
            fontWeight: 700,
          }}
          endIcon={
            <Box
              sx={{
                width: 26, height: 26, borderRadius: '50%',
                p: '2px',
                background: GRADIENT,
                display: 'grid', placeItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  bgcolor: '#fff', display: 'grid', placeItems: 'center',
                }}
              >
                <LockRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          }
        >
          Realizar el pago
        </Button>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Tiempo restante: 09:59:59
        </Typography>
      </Stack>
    </Paper>
  )
}
