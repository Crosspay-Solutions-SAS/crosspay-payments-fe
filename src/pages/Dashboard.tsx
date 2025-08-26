import {
  Box, Stack, Typography, Divider, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Alert, CircularProgress, TablePagination
} from '@mui/material'
import Sidebar from '../components/sidebar'
import { COLORS } from '../theme'
import DonutRing from '../components/donutRing'
import * as React from 'react'

// =======================
// CONFIG API y AUTH
// =======================
const API_BASE_URL = 'https://9d0921671656.ngrok-free.app'

// Endpoints
const ADMIN_GET_TRANSACTIONS = '/admin/transactions'
const ADMIN_GET_STATS_OVERVIEW = '/admin/transactions/stats/overview'
const AUTH_LOGIN = '/auth/login'

// Credenciales Admin (por ahora en el mismo archivo)
const ADMIN_EMAIL = 'admin@crosspay.com'
const ADMIN_PASSWORD = 'admin123'

// Mantiene el token actual para que lo lean helpers fuera del componente si hace falta
let CURRENT_TOKEN: string | null = null

// Login directo: obtiene y retorna el token
async function apiLogin(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}${AUTH_LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  })
  const text = await res.text()
  let data: any
  try { data = text ? JSON.parse(text) : {} } catch { data = text }

  if (!res.ok || !data?.token) {
    const msg = data?.message || text || `Login failed (${res.status})`
    throw new Error(msg)
  }
  return data.token as string
}

// GET con auth y reintento si el token expiró
async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  // asegura token
  if (!CURRENT_TOKEN) {
    CURRENT_TOKEN = await apiLogin()
  }

  // primer intento
  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${CURRENT_TOKEN}`,
      ...(init?.headers || {}),
    },
  })

  // si expiró, relogin y reintenta 1 vez
  if (res.status === 401 || res.status === 403) {
    CURRENT_TOKEN = await apiLogin()
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${CURRENT_TOKEN}`,
        ...(init?.headers || {}),
      },
    })
  }

  const text = await res.text()
  let data: any
  try { data = text ? JSON.parse(text) : {} } catch { data = text }

  if (!res.ok) {
    const msg = (data && data.message) || text || `GET ${path} failed (${res.status})`
    throw new Error(msg)
  }
  return (data ?? {}) as T
}

// =======================
// TIPOS
// =======================
type TxRaw = any
type TxUI = {
  id: string
  fecha: string
  operador: string
  divisa: string
  monto: string
  concepto: string
  persona: string
  empresa?: string
}

type Paginated<T> = {
  items: T[]
  total: number
  page: number
  limit: number
}

type StatsOverview = {
  total?: number
  paid?: number
  failed?: number
  pending?: number
  refunded?: number
  chargeback?: number
}

// =======================
// UTILS
// =======================
const dtf = new Intl.DateTimeFormat('es-CO', {
  timeZone: 'America/Bogota',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit'
})

function fmtAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP',
      maximumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${currency || ''} ${Number(amount ?? 0).toLocaleString('es-CO')}`
  }
}

function mapTxToUI(raw: TxRaw): TxUI {
  const id = raw.id || raw.transactionId || raw.paymentId || raw._id || ''
  const created = raw.createdAt || raw.created_at || raw.date || raw.timestamp || new Date().toISOString()
  const currency = raw.currency || raw.curr || 'COP'
  const amountNum = Number(raw.amount ?? raw.total ?? raw.value ?? 0)

  const concepto =
    raw.description || raw.title || raw.concept || raw.reason || '—'

  const persona =
    raw.customerName ||
    raw.customer?.name ||
    raw.payer?.name ||
    raw.buyer?.fullName ||
    '—'

  const empresa =
    raw.meta?.companyName ||
    raw.companyName ||
    raw.customer?.company ||
    raw.merchant?.name ||
    undefined

  const operador = raw.gateway || raw.provider || 'OnePay'

  return {
    id,
    fecha: dtf.format(new Date(created)),
    operador,
    divisa: currency,
    monto: fmtAmount(amountNum, currency),
    concepto,
    persona,
    empresa,
  }
}

function normalizePagination(resp: any): Paginated<TxRaw> {
  if (Array.isArray(resp?.items)) {
    return {
      items: resp.items,
      total: Number(resp.total ?? resp.count ?? resp.totalItems ?? resp.items.length),
      page: Number(resp.page ?? 1),
      limit: Number(resp.limit ?? resp.perPage ?? 10),
    }
  }
  if (Array.isArray(resp?.data)) {
    return {
      items: resp.data,
      total: Number(resp.pagination?.total ?? resp.total ?? resp.data.length),
      page: Number(resp.pagination?.page ?? 1),
      limit: Number(resp.pagination?.limit ?? 10),
    }
  }
  if (Array.isArray(resp)) {
    return { items: resp, total: resp.length, page: 1, limit: resp.length || 10 }
  }
  return { items: [], total: 0, page: 1, limit: 10 }
}

// =======================
// COMPONENTE
// =======================
export default function Dashboard() {
  const [rows, setRows] = React.useState<TxUI[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(0)        // MUI 0-based
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [stats, setStats] = React.useState<StatsOverview | null>(null)
  const [loadingStats, setLoadingStats] = React.useState(false)

  const [authLoading, setAuthLoading] = React.useState(true)
  const [authError, setAuthError] = React.useState<string | null>(null)

  // Hace login al montar y deja el token listo en CURRENT_TOKEN
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      setAuthLoading(true)
      setAuthError(null)
      try {
        const token = await apiLogin()
        if (!mounted) return
        CURRENT_TOKEN = token
      } catch (e: any) {
        if (!mounted) return
        setAuthError(e?.message || 'No se pudo autenticar.')
      } finally {
        if (mounted) setAuthLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const loadTransactions = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = `?limit=${rowsPerPage}&page=${page + 1}`
      const resp = await apiGet<any>(`${ADMIN_GET_TRANSACTIONS}${query}`)
      const norm = normalizePagination(resp)
      const mapped = norm.items.map(mapTxToUI)
      setRows(mapped)
      setTotal(norm.total)
    } catch (e: any) {
      setError(e.message || 'No se pudieron cargar las transacciones')
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage])

  const loadStats = React.useCallback(async () => {
    setLoadingStats(true)
    try {
      const resp = await apiGet<any>(ADMIN_GET_STATS_OVERVIEW)
      const s: StatsOverview = {
        total: Number(resp.total ?? resp.totalTransactions ?? resp.count ?? 0),
        paid: Number(resp.paid ?? resp.success ?? resp.completed ?? 0),
        failed: Number(resp.failed ?? resp.error ?? 0),
        pending: Number(resp.pending ?? resp.in_process ?? 0),
        refunded: Number(resp.refunded ?? 0),
        chargeback: Number(resp.chargeback ?? 0),
      }
      setStats(s)
    } catch {
      setStats(null)
    } finally {
      setLoadingStats(false)
    }
  }, [])

  // carga data cuando ya hay auth
  React.useEffect(() => {
    if (!authLoading && !authError) {
      loadTransactions()
      loadStats()
    }
  }, [authLoading, authError, loadTransactions, loadStats])

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const totalTx = stats?.total ?? 0
  const paid = stats?.paid ?? 0
  const nonPaid = Math.max(totalTx - paid, 0)

  return (
    <Box sx={{ display: 'flex', bgcolor: COLORS.bgMain, p: 0 }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1, p: 0 }}>
        <Typography variant="h5" fontWeight={800} color={COLORS.text} sx={{ mb: 0, p: 3 }}>
          Resumen De Operaciones Por Periodo
        </Typography>
        <Divider sx={{ mb: 0 }} />

        {/* Estado de autenticación */}
        {authLoading && (
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">Autenticando…</Typography>
          </Box>
        )}
        {authError && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" variant="filled">
              {authError}
            </Alert>
          </Box>
        )}

        {!authLoading && !authError && (
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
            <Paper
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 0,
                overflow: 'hidden',
                backgroundColor: 'transparent',
                borderRight: `1px solid ${COLORS.border}`,
                boxShadow: 'none',
              }}
            >
              {/* Errores de data */}
              {error && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Alert severity="error" variant="filled">{error}</Alert>
                </Box>
              )}

              <TableContainer
                sx={{
                  maxHeight: 700,
                  pr: 4,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { backgroundColor: COLORS.border },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: COLORS.border2, borderRadius: '10px' },
                  '&::-webkit-scrollbar-thumb:hover': { backgroundColor: COLORS.chevron },
                }}
              >
                <Table stickyHeader size="small" aria-label="tabla de operaciones">
                  <TableHead>
                    <TableRow>
                      {['Fecha', 'Operador', 'Divisa', 'Monto', 'Concepto', 'Persona', 'Empresa'].map((h) => (
                        <TableCell key={h} sx={{ bgcolor: 'bgMain', pt: 4 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                            <CircularProgress size={18} />
                            <Typography variant="body2">Cargando transacciones…</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Typography variant="body2" sx={{ py: 2, color: COLORS.chevron }}>
                            No hay transacciones para mostrar.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((r) => (
                        <TableRow key={r.id} hover>
                          <TableCell>{r.fecha}</TableCell>
                          <TableCell>{r.operador}</TableCell>
                          <TableCell>{r.divisa}</TableCell>
                          <TableCell>{r.monto}</TableCell>
                          <TableCell sx={{ minWidth: 320 }}>{r.concepto}</TableCell>
                          <TableCell>{r.persona}</TableCell>
                          <TableCell>{r.empresa || '—'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página"
              />
            </Paper>

            {/* Panel de totales / donuts */}
            <Paper
              sx={{
                width: { xs: '100%', lg: 380 },
                p: 2.5,
                borderRadius: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Typography fontWeight={800} sx={{ mb: 6, textAlign: 'center' }}>
                Total de Transacciones
              </Typography>

              <Stack spacing={4}>
                <DonutRing
                  total={totalTx}
                  primary={paid}
                  secondary={nonPaid}
                  subtitleBottom="OVERVIEW"
                  subtitleTop=""
                />
                <Divider />
                <DonutRing
                  total={(stats?.failed ?? 0) + (stats?.pending ?? 0)}
                  primary={stats?.failed ?? 0}
                  secondary={stats?.pending ?? 0}
                  subtitleBottom="FALLIDAS / PENDIENTES"
                  subtitleTop=""
                />
                {loadingStats && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption">Actualizando métricas…</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
