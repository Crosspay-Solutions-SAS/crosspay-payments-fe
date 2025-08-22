import { Box, Button, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'


const COLORS = {
  purple: '#5036F6',
  pink: '#E937B1',
  border: '#ECECEC',
  text: '#1E1A30',
  paragraph: '#5E5E5E',
}

export default function Sidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        bgcolor: '#fff',
        borderRight: `1px solid ${COLORS.border}`,
        px: 2.5,
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100dvh',
        position: 'sticky',
        top: 0,
      }}
    >
      <Box
        component="img"
        src="/crosspay-solutions-logo-color.svg"
        alt="Crosspay Solutions"
        sx={{ width: 160, height: 'auto', mx: 'auto', mb: 2 }}
      />

      <List component="nav" sx={{ mt: 2 }}>
        <ListItemButton selected sx={{ borderRadius: 2 }}>
          <ListItemText
            primary={<Typography fontWeight={700}>Panel de Control</Typography>}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 2 }}>
          <ListItemText primary="Configuración" />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 2 }}>
          <ListItemText primary="Cuenta" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Button
        fullWidth
        variant="contained"
        endIcon={<NorthEastRoundedIcon />}
        sx={{
          background: `linear-gradient(90deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`,
          '&:hover': { background: `linear-gradient(90deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`, filter: 'brightness(0.95)' },
          borderRadius: 999,
          py: 1.2,
          fontWeight: 700,
        }}
      >
        Cerrar Sesión
      </Button>

      <Typography variant="caption" sx={{ color: COLORS.paragraph, mt: 1, textAlign: 'center' }}>
        Crosspay App Recaudos v1.0.0
      </Typography>
    </Box>
  )
}