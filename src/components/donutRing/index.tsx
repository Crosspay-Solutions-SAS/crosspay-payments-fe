import { Box, Chip, Stack, Typography } from "@mui/material"
import { COLORS } from "../../theme"
import LegendItem from "../legendItem"

export default function DonutRing({
  total,
  primary,
  secondary,
  subtitleTop,
  subtitleBottom,
}: {
  total: number
  primary: number
  secondary: number
  subtitleTop: string
  subtitleBottom: string
}) {
  const totalSafe = Math.max(0, total)
  const pPct = totalSafe === 0 ? 0 : Math.round((primary / totalSafe) * 100)
  const sPct = Math.max(0, 100 - pPct)

  const ring = `conic-gradient(${COLORS.purple} 0% ${pPct}%, ${COLORS.pink} ${pPct}% 100%)`

  return (
    <Stack direction="row" spacing={3} alignItems="center">
      <Box sx={{ position: 'relative', width: 180, height: 180 }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: ring,
            p: '12px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#fff',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Box textAlign="center" sx={{ lineHeight: 1.05 }}>
              <Typography variant="h3" fontWeight={800}>{total}</Typography>
              <Typography variant="caption" sx={{ color: COLORS.paragraph }}>
                Transacciones
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: COLORS.paragraph }}>
                {subtitleBottom}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Stack spacing={1.5}>
        <LegendItem color={COLORS.purple} label={`${primary} - ${pPct}%`} helper="OnePay" />
        <LegendItem color={COLORS.pink} label={`${secondary} - ${sPct}%`} helper="Vita Wallet" />
        {subtitleTop ? (
          <Chip
            label={subtitleTop}
            size="small"
            sx={{ alignSelf: 'start', bgcolor: '#F7F7F7', color: COLORS.text }}
          />
        ) : null}
      </Stack>
    </Stack>
  )
}