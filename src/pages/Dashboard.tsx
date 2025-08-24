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

const rows: Row[] = Array.from({ length: 30 }).map((_, i) => ({
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
    <Box sx={{ display: 'flex', bgcolor: COLORS.bgMain, p: 0 }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1, p: 0 }}>
        <Typography variant="h5" fontWeight={800} color={COLORS.text} sx={{ mb: 0, p: 3 }}>
          Resumen De Operaciones Por Periodo
        </Typography>
        <Divider sx={{ mb: 0 }} />

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
            <TableContainer 
              sx={{ 
                maxHeight: 700, 
                pr: 4,
                '&::-webkit-scrollbar': {
                  width: '6px',                     // Ancho de la barra
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: COLORS.border,   // Fondo del track
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: COLORS.border2,  // Color del desplazador
                  borderRadius: '10px',             // Redondeo
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: COLORS.chevron,  // Color al hacer hover
                },
              }}>
              <Table stickyHeader size="small" aria-label="tabla de operaciones">
                <TableHead>
                  <TableRow>
                    {['Fecha', 'Operador', 'Divisa', 'Monto', 'Concepto', 'Persona', 'Empresa'].map((h) => (
                      <TableCell key={h} sx={{ bgcolor: 'bgMain', pt: 4 }}>{h}</TableCell>
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
                total={200}
                primary={150}
                secondary={50}
                subtitleBottom="AGOSTO" subtitleTop={''}
              />
              <Divider />
              <DonutRing
                total={380}
                primary={190}
                secondary={190}
                subtitleBottom="2025" subtitleTop={''}
              />
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  )
}
