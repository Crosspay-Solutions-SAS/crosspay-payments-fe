import {
  Box, Stack, Typography, Divider, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Chip,
} from '@mui/material'
import Sidebar from '../components/sidebar'
import { COLORS } from '../theme'
import DonutRing from '../components/donutRing'

type Row = {
  fecha: string
  operador: string
  divisa: string
  monto: string
  concepto: string
  persona: string
  empresa?: string
}

const rows: Row[] = Array.from({ length: 20 }).map((_, i) => ({
  fecha: '31/05/2025',
  operador: 'OnePay',
  divisa: 'USD',
  monto: '$1,500.00',
  concepto: 'Pago de pruebas para recaudo con tarjeta.',
  persona: 'William Cárdenas Bohórquez',
  empresa: 'Crosspay Solutions'
}))


export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', bgcolor: '#F7F7F7' }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1, p: 3.5 }}>
        <Typography variant="h5" fontWeight={800} color={COLORS.text} sx={{ mb: 1 }}>
          Resumen De Operaciones Por Periodo
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
          <Paper
            sx={{
              flex: 1,
              p: 0,
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader size="medium" aria-label="tabla de operaciones">
                <TableHead>
                  <TableRow>
                    {['Fecha', 'Operador', 'Divisa', 'Monto', 'Concepto', 'Persona', 'Empresa'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell>{r.operador}</TableCell>
                      <TableCell>{r.divisa}</TableCell>
                      <TableCell>{r.monto}</TableCell>
                      <TableCell sx={{ minWidth: 320 }}>{r.concepto}</TableCell>
                      <TableCell>{r.persona}</TableCell>
                      <TableCell>{r.empresa}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper
            sx={{
              width: { xs: '100%', lg: 380 },
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Typography fontWeight={800} sx={{ mb: 2 }}>
              Total de Transacciones
            </Typography>

            <Stack spacing={4}>
              <DonutRing
                total={200}
                primary={150}
                secondary={50}
                subtitleTop="AGOSTO"
                subtitleBottom="AGOSTO"
              />
              <Divider />
              <DonutRing
                total={380}
                primary={190}
                secondary={190}
                subtitleTop="2025"
                subtitleBottom="2025"
              />
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  )
}
