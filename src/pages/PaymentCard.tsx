import * as React from 'react'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { COLORS } from '../theme'
import {
  Box, Paper, Typography, Stack, TextField, Select, MenuItem,
  FormControl, InputLabel, Checkbox, FormControlLabel, Button,
  Divider, InputAdornment
} from '@mui/material'
import { styled } from "@mui/material/styles";

const providers = [
  'Bancolombia', 'Pagos PSE', 'Nequi', 'Daviplata',
  'Bancolombia BNPL', 'Tarjetas de Crédito/Débito',
]

const GRADIENT = `linear-gradient(90deg, ${COLORS.btn1} 0%, ${COLORS.btn2} 100%)`

// Label con estilos unificados
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="body2"
    fontSize="0.85rem"
    fontWeight={400}
    sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}
  >
    {children}
  </Typography>
)

// TextField con estilos unificados
const StyledInput = (props: any) => (
  <TextField
    fullWidth
    {...props}
    sx={{
      '& input': { color: COLORS.textTitle, padding: '0.75rem 1rem' },
      ...props.sx,
    }}
  />
)

// Checkbox personalizado
const CustomCheckbox = styled(Checkbox)(() => ({
  padding: 4, // hace más pequeño el área clickable
  "& .MuiSvgIcon-root": {
    fontSize: "0.9rem", // tamaño del check
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
  "&.Mui-checked": {
    color: COLORS.btn2, 
  },
  "&.Mui-focusVisible": {
    boxShadow: "none", 
  },
}));

export default function PaymentCard() {
  const [provider, setProvider] = React.useState('Bancolombia')
  const [terms, setTerms] = React.useState(false)
  const [currency, setCurrency] = React.useState<'COP' | 'MXN' | 'ARS'>('COP')
  const [amountRaw, setAmountRaw] = React.useState('')

  const handleAmountChange = (val: string) => {
    setAmountRaw(val.replace(/[^\d]/g, ''))
  }

  return (
    <>
      {/* Logo */}
      <Box
        component="img"
        src="/crosspay-solutions-logo-color.svg"
        alt="Crosspay Solutions"
        sx={{ width: 160, display: 'block', mx: 'auto', mb: 2 }}
      />

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, width: 420, maxWidth: '100%', mx: 'auto' }}>
        <Stack spacing={2}>
          {/* Títulos */}
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={800} mb={1}>
              Pago a Crosspay
            </Typography>
            <Typography variant="body2">
              Verifica que la información esté correcta para proceder con el pago.
            </Typography>
          </Box>

          <Divider />

          {/* Monto + Divisa */}
          <Box>
            <FieldLabel>Monto de la transacción</FieldLabel>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <FormControl sx={{ minWidth: 90 }}>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'COP' | 'MXN' | 'ARS')}
                  IconComponent={ExpandMoreRoundedIcon}
                  sx={{ '& .MuiSelect-select': { p: '0.75rem 1rem' } }}
                >
                  <MenuItem value="COP">COP</MenuItem>
                  <MenuItem value="MXN">MXN</MenuItem>
                  <MenuItem value="ARS">ARS</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                value={amountRaw}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                inputProps={{ inputMode: 'numeric' }}
                sx={{
                  '& .MuiInputAdornment-root.MuiInputAdornment-positionStart': { mr: 0 },
                  '& input.MuiInputBase-inputAdornedStart': { pl: '5px' },
                  '& input': {
                    fontWeight: 600, fontSize: '1.3rem',
                    color: COLORS.textTitle, p: '0.4rem 1rem',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ fontSize: '1.1rem', color: COLORS.chevron, pt: 0.1, }}>
                        $
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>

          {/* Concepto */}
          <Box>
            <FieldLabel>Concepto</FieldLabel>
            <StyledInput inputProps={{ 'aria-label': 'concepto' }} />
          </Box>

          {/* Proveedor */}
          <Box>
            <FieldLabel>Elige un proveedor de pago</FieldLabel>
            <FormControl fullWidth>
              <Select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                IconComponent={ExpandMoreRoundedIcon}
                sx={{ '& .MuiSelect-select': { p: '0.75rem 1rem' } }}
              >
                {providers.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Nombre usuario */}
          <Box>
            <FieldLabel>Nombre de quien hace el envío</FieldLabel>
            <StyledInput inputProps={{ 'aria-label': 'nombre' }} />
          </Box>

          {/* Nombre empresa */}
          <Box>
            <FieldLabel>Nombre de la empresa</FieldLabel>
            <StyledInput inputProps={{ 'aria-label': 'empresa' }} />
          </Box>

          {/* Términos */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              pl: 3,
            }}
          >
          <FormControlLabel
            control={<CustomCheckbox checked={terms} onChange={(e) => setTerms(e.target.checked)} />}
            label={
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Acepto los{' '}
                <Box
                  component="a"
                  href="https://crosspaysolutions.com/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: "underline",
                    color: "pink.main",
                    "&:hover": {
                      color: "btn1.main", 
                    },
                  }}
                >
                  Términos y Condiciones
                </Box>{' '}del servicio.
              </Typography>
            }
          />
          </Box>

          {/* Botón */}
          <Button
            variant="contained"
            disabled={!terms}
            onClick={() => console.log('pago')}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
              width: 'fit-content',
              alignSelf: 'center',
              background: terms ? GRADIENT : COLORS.btn3,
              color: '#fff',
              borderRadius: 999,
              py: 0.7,
              pl: 2.8,
              pr: 1.3,
              fontWeight: 700,
              outline: 'none',
              boxShadow: 'none',
              transition: 'transform 0.25s ease-in-out',
              '&:hover': {
                background: terms ? GRADIENT : COLORS.btn3,
                transform: terms ? 'translateY(-2px)' : 'none',
                boxShadow: 'none',
              },
              '&:focus': { outline: 'none' },
            }}
            endIcon={
              <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: COLORS.bgSec, display: 'grid', placeItems: 'center' }}>
                <LockRoundedIcon sx={{ fontSize: 16, color: terms ? COLORS.btn1 : 'inherit' }} />
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
    </>
  )
}
