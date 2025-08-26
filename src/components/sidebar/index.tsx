import { Box, Button, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";

const COLORS = {
  purple: "#5036F6",
  pink: "#E937B1",
  border: "#ECECEC",
  text: "#1E1A30",
  paragraph: "#5E5E5E",
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAdmin = pathname.startsWith("/admin");
  const isConfig = pathname.startsWith("/configuracion");
  const isCuenta = pathname.startsWith("/cuenta");

  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        bgcolor: "transparent",
        borderRight: `1px solid ${COLORS.border}`,
        px: 2.5,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: "100dvh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box
        component="img"
        src="/crosspay-solutions-logo-color.svg"
        alt="Crosspay Solutions"
        sx={{ width: 160, height: "auto", mx: "auto", mb: 2 }}
      />

      <List component="nav" sx={{ mt: 2 }}>
        <ListItemButton
          component={Link}
          to="/admin"
          selected={isAdmin}
          sx={{
            borderRadius: 1,
            bgcolor: isAdmin ? "primary.main" : "grey.100",
            color: isAdmin ? "textTitle" : "inherit",
            "&:hover": {
              bgcolor: isAdmin ? "primary.dark" : "grey.200",
            },
          }}
        >
          <ListItemText
            primary={<Typography fontWeight={700}>Panel de Control</Typography>}
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/configuracion"
          selected={isConfig}
          sx={{
            borderRadius: 1,
            bgcolor: isConfig ? "primary.main" : "grey.100",
            color: isConfig ? "textTitle" : "inherit",
            "&:hover": {
              bgcolor: isConfig ? "primary.dark" : "grey.200",
            },
          }}
        >
          <ListItemText primary="Configuración" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/cuenta"
          selected={isCuenta}
          sx={{
            borderRadius: 1,
            bgcolor: isCuenta ? "primary.main" : "grey.100",
            color: isCuenta ? "textTitle" : "inherit",
            "&:hover": {
              bgcolor: isCuenta ? "primary.dark" : "grey.200",
            },
          }}
        >
          <ListItemText primary="Cuenta" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Button
        fullWidth
        variant="contained"
        endIcon={<NorthEastRoundedIcon />}
        onClick={() => navigate("/")} // ajusta si quieres otra ruta
        sx={{
          background: `linear-gradient(90deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`,
          "&:hover": {
            background: `linear-gradient(90deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`,
            filter: "brightness(0.95)",
          },
          borderRadius: 999,
          py: 1.2,
          fontWeight: 700,
        }}
      >
        Cerrar Sesión
      </Button>

      <Typography variant="caption" sx={{ color: COLORS.paragraph, mt: 1, textAlign: "center" }}>
        Crosspay App Recaudos v1.0.0
      </Typography>
    </Box>
  );
}
