import * as React from 'react';
import { Box, Paper, Stack, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { adminLogin } from '../api/adminLogin';

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await adminLogin(email, password);
      onSuccess();
    } catch (e: any) {
      setErr(e.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Paper sx={{ p: 3, width: 360 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Ingreso administrador</Typography>
        <form onSubmit={submit}>
          <Stack spacing={1.5}>
            <TextField type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField type="password" label="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            {err && <Alert severity="error">{err}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <><CircularProgress size={16} sx={{ mr: 1 }} />Ingresando…</> : 'Ingresar'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
