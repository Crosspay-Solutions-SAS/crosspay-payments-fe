import * as React from 'react'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { COLORS } from '../theme'
import {
  Box, Paper, Typography, Stack, TextField, Select, MenuItem, FormControl, 
  Button, Divider, InputAdornment, Snackbar, Alert, CircularProgress
} from '@mui/material'

// =======================
// CONFIG/API
// =======================
// Normalizo BASE para evitar doble slash en fetch
const API_BASE_URL = 'https://9d0921671656.ngrok-free.app/'
const CLIENT_CREATE_PAYMENT = '/client/payment'
const CLIENT_GET_PSE_METHODS = '/client/pse-methods'

const getAuthToken = () => localStorage.getItem('token') || undefined
const BASE = API_BASE_URL.replace(/\/+$/, '')

async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data: any
  try { data = text ? JSON.parse(text) : {} } catch { data = text }

  if (!res.ok) {
    const msg = data?.errors?.length
      ? data.errors.map((e: any) => e.message).join(' • ')
      : (data?.message || text || `POST ${path} failed (${res.status})`)
    throw new Error(msg)
  }
  return (data ?? {}) as T
}

async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  })
  const text = await res.text()
  let data: any
  try { data = text ? JSON.parse(text) : {} } catch { data = text }
  if (!res.ok) {
    const msg = data?.message || text || `GET ${path} failed (${res.status})`
    throw new Error(msg)
  }
  return (data ?? {}) as T
}

// =======================
// TIPOS
// =======================
type Currency = 'COP' | 'MXN' | 'ARS'
type ProviderUi = 'Pagos PSE' | 'Tarjetas de Crédito/Débito'

type PaymentResponse = {
  success?: boolean
  paymentId?: string
  transactionId?: string
  status?: 'created' | 'processing' | 'requires_action' | 'failed' | 'paid' | 'pending'
  message?: string
  gateway?: string
  // posibles urls de checkout
  checkoutUrl?: string
  paymentUrl?: string
  redirectUrl?: string
  errors?: Array<{ message: string }>
}

type PseMethod = { code: string; name: string }

// =======================
// UTILS
// =======================
const GRADIENT = `linear-gradient(90deg, ${COLORS.btn1} 0%, ${COLORS.btn2} 100%)`
const onlyDigits = (s: string) => s.replace(/\D/g, '')
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Fallbacks PSE
const PSE_BANKS_FALLBACK: PseMethod[] = [
  { code: 'Bancolombia', name: 'Bancolombia' },
  { code: 'Davivienda', name: 'Davivienda' },
  { code: 'BBVA', name: 'BBVA' },
  { code: 'BANCO_DE_BOGOTA', name: 'Banco de Bogotá' },
  { code: 'BANCO_POPULAR', name: 'Banco Popular' },
]
const DOC_TYPES = ['CC', 'CE', 'NIT', 'TI', 'PP'] as const
const PERSON_TYPES = ['natural', 'juridica'] as const

// =======================
// COMPONENTE
// =======================
export default function PaymentCard() {
  // Base
  const [provider, setProvider] = React.useState<ProviderUi>('Tarjetas de Crédito/Débito')
  const [terms, setTerms] = React.useState(false)
  const [currency, setCurrency] = React.useState<Currency>('COP')
  const [amountRaw, setAmountRaw] = React.useState('')

  const [concept, setConcept] = React.useState('')       // description
  const [reference, setReference] = React.useState('')   // reference
  const [senderName, setSenderName] = React.useState('') // customer.name
  const [email, setEmail] = React.useState('')           // customer.email
  const [phone, setPhone] = React.useState('')           // customer.phone
  const [companyName, setCompanyName] = React.useState('') // opcional meta

  // Card
  const [cardNumber, setCardNumber] = React.useState('')
  const [cardExpMonth, setCardExpMonth] = React.useState('')
  const [cardExpYear, setCardExpYear] = React.useState('')
  const [cardCvc, setCardCvc] = React.useState('')
  const [cardHolder, setCardHolder] = React.useState('')

  // PSE
  const [pseBanks, setPseBanks] = React.useState<PseMethod[]>(PSE_BANKS_FALLBACK)
  const [pseBank, setPseBank] = React.useState('')
  const [pseDocType, setPseDocType] = React.useState<(typeof DOC_TYPES)[number]>('CC') /* VERIFICAR ESTE CAMBIO */
  const [pseDocNumber, setPseDocNumber] = React.useState('')
  const [psePersonType, setPsePersonType] = React.useState<(typeof PERSON_TYPES)[number]>('natural')

  const [loading, setLoading] = React.useState(false)
  const [snack, setSnack] = React.useState<{open: boolean; type: 'success'|'error'|'info'; msg: string}>({open:false, type:'info', msg:''})

  const amountNumber = React.useMemo(() => {
    const n = onlyDigits(amountRaw)
    return n ? parseInt(n, 10) : 0
  }, [amountRaw])

  const paymentMethod: 'card' | 'pse' =
    provider === 'Tarjetas de Crédito/Débito' ? 'card' : 'pse'

  React.useEffect(() => {
    (async () => {
      try {
        const data: any = await apiGet<any>(CLIENT_GET_PSE_METHODS)
        let banks: PseMethod[] = []
        if (Array.isArray(data)) {
          if (typeof data[0] === 'string') {
            banks = data.map((s: string) => ({ code: s, name: s.replace(/_/g, ' ') }))
          } else if (data[0]?.code && data[0]?.name) {
            banks = data as PseMethod[]
          }
        } else if (data?.banks && Array.isArray(data.banks)) {
          banks = data.banks.map((b: any) => ({
            code: b.code || b.id || b.bankCode || b.name,
            name: b.name || b.displayName || b.code,
          }))
        }
        if (banks.length) setPseBanks(banks)
      } catch {
        // silencioso: deja fallback
      }
    })()
  }, [])

  // Validaciones
  const baseValid =
    terms &&
    amountNumber > 0 &&
    concept.trim().length > 0 &&
    reference.trim().length > 0 &&
    senderName.trim().length > 0 &&
    isValidEmail(email)

  const cardValid = React.useMemo(() => {
    if (paymentMethod !== 'card') return true
    const num = onlyDigits(cardNumber)
    const mm = onlyDigits(cardExpMonth)
    const yy = onlyDigits(cardExpYear)
    const cvc = onlyDigits(cardCvc)
    const holderOk = cardHolder.trim().length > 2
    const mmNum = Number(mm)
    const yearOk = yy.length >= 2 // admite '25' o '2025'
    return (
      num.length >= 13 && num.length <= 19 &&
      mm.length >= 1 && mmNum >= 1 && mmNum <= 12 &&
      yearOk &&
      (cvc.length === 3 || cvc.length === 4) &&
      holderOk
    )
  }, [paymentMethod, cardNumber, cardExpMonth, cardExpYear, cardCvc, cardHolder])

  const pseValid = React.useMemo(() => {
    if (paymentMethod !== 'pse') return true
    return (
      pseBank.trim().length > 0 &&
      pseDocType !== '' &&
      onlyDigits(pseDocNumber).length >= 6 &&
      (psePersonType === 'natural' || psePersonType === 'juridica')
    )
  }, [paymentMethod, pseBank, pseDocType, pseDocNumber, psePersonType])

  const canSubmit = baseValid && cardValid && pseValid && !loading

  // Handlers
  const handleAmountChange = (val: string) => setAmountRaw(onlyDigits(val))
  const handleCardNumberChange = (v: string) => setCardNumber(onlyDigits(v).slice(0, 19))
  const handleCardExpMonthChange = (v: string) => setCardExpMonth(onlyDigits(v).slice(0, 2))
  const handleCardExpYearChange = (v: string) => setCardExpYear(onlyDigits(v).slice(0, 4))
  const handleCardCvcChange = (v: string) => setCardCvc(onlyDigits(v).slice(0, 4))

  // Submit
  const handlePay = async () => {
    if (!canSubmit) {
      const reasons: string[] = []
      if (!terms) reasons.push('Aceptar términos')
      if (!(amountNumber > 0)) reasons.push('Monto válido')
      if (!concept.trim()) reasons.push('Descripción')
      if (!reference.trim()) reasons.push('Referencia')
      if (!senderName.trim()) reasons.push('Nombre del cliente')
      if (!isValidEmail(email)) reasons.push('Email válido')
      if (paymentMethod === 'card' && !cardValid) reasons.push('Campos de tarjeta válidos')
      if (paymentMethod === 'pse' && !pseValid) reasons.push('Campos PSE válidos')
      setSnack({ open: true, type: 'error', msg: `Faltan/Inválidos: ${reasons.join(' • ')}` })
      return
    }

    setLoading(true)
    try {
      const basePayload: any = {
        paymentMethod,                // 'card' | 'pse'
        amount: amountNumber,         // si backend usa centavos: amountNumber * 100
        currency,
        description: concept.trim(),
        reference: reference.trim(),
        customer: {
          name: senderName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        // alias top-level por compatibilidad con validadores previos
        customerName: senderName.trim(),
        customerEmail: email.trim(),
        meta: {
          companyName: companyName.trim() || undefined,
          uiProvider: provider,
        },
      }

      const payload =
        paymentMethod === 'card'
          ? {
              ...basePayload,
              card: {
                number: onlyDigits(cardNumber),
                exp_month: cardExpMonth,
                exp_year: cardExpYear,
                cvc: onlyDigits(cardCvc),
                holder_name: cardHolder.trim() || senderName.trim(),
              },
            }
          : {
              ...basePayload,
              pse: {
                bank: pseBank,
                documentType: pseDocType,
                documentNumber: pseDocNumber,
                personType: psePersonType,
              },
            }

      // debug seguro en dev (mask)
      if (process.env.NODE_ENV !== 'production') {
        const clone = JSON.parse(JSON.stringify(payload))
        if (clone.card) { clone.card.number = '****'; clone.card.cvc = '***' }
        console.log('PAYMENT PAYLOAD →', clone)
      }

      const resp = await apiPost<PaymentResponse>(CLIENT_CREATE_PAYMENT, payload)

      if (resp?.success === false || resp?.status === 'failed') {
        const msg = resp?.errors?.length
          ? resp.errors.map(e => e.message).join(' • ')
          : (resp?.message || 'No se pudo crear el pago')
        throw new Error(msg)
      }

      const checkoutUrl = resp.checkoutUrl || resp.paymentUrl || resp.redirectUrl

      if (paymentMethod === 'pse') {
        if (checkoutUrl) {
          if (resp.transactionId) sessionStorage.setItem('lastTxId', resp.transactionId)
          window.location.href = checkoutUrl
          return
        } else {
          throw new Error('La pasarela PSE no retornó un checkoutUrl.')
        }
      }

      // Tarjeta: generalmente en el mismo formulario, pero si llega URL, la dejamos opcional.
      if (checkoutUrl) {
        console.log('Se recibió un checkoutUrl para tarjeta (opcional):', checkoutUrl)
        // window.location.href = checkoutUrl // si quisieras redirigir también con tarjeta
      }

      setSnack({ open: true, type: 'success', msg: resp.message || 'Pago creado. Sigue las instrucciones.' })
    } catch (e: any) {
      setSnack({ open: true, type: 'error', msg: e.message || 'Error al procesar el pago' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      mt: { xs: '12%', sm: '5%', md: '0' },
      mb: { xs: '12%', sm: '5%', md: '0' },
    }}>

      {/* Contenedor de las transacciones */}
      <Paper elevation={0} 
      sx={{ 
        p: { xs: 2.5, sm: 4 }, 
        width: 720, 
        maxWidth: { xs: '90%', sm: '50%', md: '70%' }, 
        mx: 'auto', 
      }}>
        
        <Stack spacing={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100px',
        }}>
          {/* Logo */}
          <Box
            component="img"
            src="/crosspay-solutions-logo-color.svg"
            alt="Crosspay Solutions"
            sx={{ width: 180, display: 'block', mx: 'auto', mt:6, mb: 4 }}
          />
          {/* Encabezado */}
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={800} mb={1}>
              Procesamiento de Pagos
            </Typography>
            <Typography variant="body2">
              Completa el formulario para realizar un pago seguro con Crosspay Solutions.
            </Typography>
          </Box>

          <Divider />

          <Stack sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>

            {/* Columna 1 */}
            <Box sx={{ flex: '1' }}>

              {/* Monto + Divisa */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Monto</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <FormControl sx={{ minWidth: 100 }}>
                    <Select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      IconComponent={ExpandMoreRoundedIcon}
                      sx={{ '& .MuiSelect-select': { p: '0.6rem 1rem' } }}
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
                    inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                    sx={{
                      '& .MuiInputAdornment-root.MuiInputAdornment-positionStart': { mr: 0 },
                      '& input.MuiInputBase-inputAdornedStart': { pl: '5px' },
                      '& input': {
                        fontWeight: 600, fontSize: '1.3rem',
                        color: COLORS.placeHolder, p: '0.4rem 1rem',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ fontSize: '1.1rem', color: COLORS.chevron, pt: 0.1 }}>
                            $
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Box>

              {/* Descripción + Referencia */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Descripción</Typography>
                <TextField fullWidth value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Ej: Servicios de consultoría"
                  sx={{
                    '& input': {
                      color: COLORS.placeHolder, p: '0.6rem 1rem',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Referencia</Typography>
                <TextField fullWidth value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ej: FACT-2025-00123"
                  sx={{
                    '& input': {
                      color: COLORS.placeHolder, p: '0.6rem 1rem',
                    },
                  }}
                />
              </Box>

              {/* Datos del cliente */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Nombre del cliente</Typography>
                <TextField fullWidth value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Ej: Juan Pérez"
                  sx={{
                    '& input': {
                      color: COLORS.placeHolder, p: '0.6rem 1rem',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Email del cliente</Typography>
                <TextField
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="micorreo@midominio.com"
                  type="email"
                  error={!!email && !isValidEmail(email)}
                  helperText={!!email && !isValidEmail(email) ? 'Ingresa un email válido' : ''}
                  sx={{
                    '& input': {
                      color: COLORS.placeHolder, p: '0.6rem 1rem',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Teléfono</Typography>
                <TextField fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} inputProps={{ inputMode: 'numeric', maxLength: 15 }} placeholder="XXX XXXX XXX" type="tel"
                sx={{
                    '& input': {
                      color: COLORS.placeHolder, p: '0.6rem 1rem',
                    },
                  }}
                />
              </Box>
            
            </Box>
            
            {/* Columna 2 */}
            <Box sx={{ flex: '1' }}>
              
              {/* Empresa (opcional) */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Nombre de la empresa (opcional)</Typography>
                <TextField fullWidth value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Mi Empresa S.A.S."
                  sx={{
                    '& input': {
                      color: COLORS.placeHolder, p: '0.6rem 1rem',
                    },
                  }}
                />
              </Box>

              {/* Proveedor (solo PSE y Tarjeta) */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Proveedor de pago</Typography>
                <FormControl fullWidth>
                  <Select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as ProviderUi)}
                    IconComponent={ExpandMoreRoundedIcon}
                    sx={{ '& .MuiSelect-select': { p: '0.6rem 1rem' } }}
                  >
                    <MenuItem value="Pagos PSE">Pagos PSE</MenuItem>
                    <MenuItem value="Tarjetas de Crédito/Débito">Tarjetas de Crédito/Débito</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* ===== Inputs condicionales ===== */}
              {paymentMethod === 'card' && (
                <Box sx={{ mb: 1.5 }}>

                  <Stack spacing={1.2}>
                    <FormControl fullWidth>
                      <Typography variant="body2" sx={{ mb: 0.5, ml: 0.5, color: COLORS.label }}>Datos de la Tarjeta</Typography>
                      <TextField
                        fullWidth
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="Número de tarjeta (solo dígitos)"
                        inputProps={{ inputMode: 'numeric' }}
                        sx={{
                          '& input': {
                            color: COLORS.placeHolder, p: '0.6rem 1rem',
                          },
                        }}
                      />
                    </FormControl>

                    <Stack direction="row" spacing={1.5}>
                      <FormControl fullWidth>
                        <Typography variant="body2" sx={{ mt: 0.45, mb: 0.5, ml: 0.5, color: COLORS.label }}>Mes</Typography>
                        <TextField
                          fullWidth
                          value={cardExpMonth}
                          onChange={(e) => handleCardExpMonthChange(e.target.value)}
                          inputProps={{ inputMode: 'numeric', maxLength: 2 }}
                          placeholder="MM"
                          sx={{
                            '& .MuiInputBase-root': {
                              color: COLORS.placeHolder,
                              height: '40px',
                              fontSize: '1rem',
                            },
                            '& .MuiInputBase-input': {
                              padding: '8px 12px',
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 1.5 }}>
                        <Typography variant="body2" sx={{ mt: 0.45, mb: 0.5, ml: 0.5, color: COLORS.label }}>Año</Typography>
                        <TextField
                          value={cardExpYear}
                          onChange={(e) => handleCardExpYearChange(e.target.value)}
                          fullWidth
                          inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                          placeholder='YYYY'
                          sx={{
                            '& .MuiInputBase-root': {
                              color: COLORS.placeHolder,
                              height: '40px',
                              fontSize: '1rem',
                            },
                            '& .MuiInputBase-input': {
                              padding: '0px 12px',
                            },
                          }}
                        />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 1.5 }}>
                          <Typography variant="body2" sx={{ mt: 0.45, mb: 0.5, ml: 0.5, color: COLORS.label }}>CVC</Typography>
                        <TextField
                          fullWidth
                          value={cardCvc}
                          onChange={(e) => handleCardCvcChange(e.target.value)}
                          inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                          placeholder='000'
                          sx={{
                            '& .MuiInputBase-root': {
                              color: COLORS.placeHolder,
                              height: '40px',
                              fontSize: '1rem',
                            },
                            '& .MuiInputBase-input': {
                              padding: '8px 12px',
                            },
                          }}
                        />
                        </FormControl>
                    </Stack>

                    <FormControl fullWidth>
                      <Typography variant="body2" sx={{ mt: 0.45, mb: 0.5, ml: 0.5, color: COLORS.label }}>Nombre del Titular</Typography>
                      <TextField
                        fullWidth
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Nombre como aparece en la tarjeta"
                        sx={{
                          '& input': {
                            color: COLORS.placeHolder, p: '0.6rem 1rem',
                          },
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Box>
              )}

              {paymentMethod === 'pse' && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5, color: COLORS.label }}>Datos PSE</Typography>

                  <Stack spacing={1.2}>
                    <FormControl fullWidth>
                      <Select
                        value={pseBank}
                        onChange={(e) => setPseBank(e.target.value as string)}
                        displayEmpty
                        sx={{ '& .MuiSelect-select': { p: '0.6rem 1rem' } }}
                      >
                        <MenuItem value="" sx={{ color:COLORS.placeHolder }}>Selecciona banco</MenuItem>
                        {pseBanks.map(b => <MenuItem key={b.code} value={b.code}>{b.name}</MenuItem>)}
                      </Select>
                    </FormControl>

                    <Stack direction="row" spacing={1}>
                      <FormControl fullWidth sx={{ mb: 1.5 }}>
                        <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5, ml: 0.5, color: COLORS.label }}>Tipo de Documento</Typography>
                        <Select
                          value={pseDocType}
                          onChange={(e) => setPseDocType(e.target.value as any)}
                          displayEmpty
                          sx={{ '& .MuiSelect-select': { p: '0.5rem 1rem' } }}
                        >
                          {DOC_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth sx={{ mb: 1.5 }}>
                        <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5, ml: 0.5, color: COLORS.label }}>Núm. de Documento</Typography>
                        <TextField
                          fullWidth
                          value={pseDocNumber}
                          onChange={(e) => setPseDocNumber(onlyDigits(e.target.value))}
                          inputProps={{ inputMode: 'numeric', maxLength: 15 }}
                          placeholder="1000123456"
                          sx={{
                            '& input': {
                              fontSize: '',
                              p: '0.6rem 1rem',
                            },

                          }}
                        />
                      </FormControl>
                    </Stack>

                    <FormControl fullWidth>
                      <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5, ml: 0.5, color: COLORS.label }}>Tipo de Persona</Typography>
                      <Select
                        value={psePersonType}
                        onChange={(e) => setPsePersonType(e.target.value as any)}
                        sx={{ '& .MuiSelect-select': { p: '0.6rem 1rem' } }}
                      >
                        {PERSON_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              )}

              {/* Términos */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', mt: 1 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    style={{ marginRight: 5 }}
                  />
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Acepto los{' '}
                    <Box
                      component="a"
                      href="https://crosspaysolutions.com/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'underline', color: 'pink.main', '&:hover': { color: 'btn1.main' } }}
                    >
                      Términos y Condiciones
                    </Box>{' '}del servicio.
                  </Typography>
                </label>
              </Box>

              {/* Botón */}
              <Button
                variant="contained"
                disabled={!canSubmit}
                onClick={handlePay}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  width: 'fit-content',
                  mx: 'auto',
                  alignSelf: 'center',
                  background: canSubmit ? GRADIENT : COLORS.btn3,
                  color: COLORS.bgSec,
                  borderRadius: 999,
                  py: 0.7,
                  pl: 2.8,
                  pr: 1.3,
                  fontWeight: 700,
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'transform 0.25s ease-in-out',
                  '&:hover': {
                    background: canSubmit ? GRADIENT : COLORS.btn3,
                    transform: canSubmit ? 'translateY(-2px)' : 'none',
                    boxShadow: 'none',
                  },
                  '&:focus': { outline: 'none' },
                  mt: { xs: '7%', md: '2.5%' },
                  mb: { xs: '5%', md: '0' },
                }}
                endIcon={
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: COLORS.bgSec, display: 'grid', placeItems: 'center' }}>
                    {loading
                      ? <CircularProgress size={16} />
                      : <LockRoundedIcon sx={{ fontSize: 16, color: canSubmit ? COLORS.btn1 : 'inherit' }} />
                    }
                  </Box>
                }
              >
                {loading ? 'Procesando…' : 'Realizar el pago'}
              </Button>

            </Box>
          </Stack>
        </Stack>

      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={7000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.type} onClose={() => setSnack(s => ({ ...s, open: false }))} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
    </>
  )
}