import { Box, Stack, Typography } from "@mui/material";
import { COLORS } from "../../theme";

export default function LegendItem({ color, label, helper }: { color: string; label: string; helper: string }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
      <Box>
        <Typography fontSize={14} fontWeight={700}>{label}</Typography>
        <Typography fontSize={12} sx={{ color: COLORS.paragraph }}>{helper}</Typography>
      </Box>
    </Stack>
  )
}
