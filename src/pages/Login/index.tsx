import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { CustomSnackbar } from '../../components/CustomSnackbar';
import { loginThunk } from '../../store/auth/auth.thunk';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function Login() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await dispatch(loginThunk({ username, password })).unwrap();
    } catch {
      setSnackbarOpen(true);
    }
  }

  return (
    <>
      <Box component="form" onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Usuário"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          slotProps={{
            inputLabel: { required: false }
          }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          slotProps={{
            inputLabel: { required: false }
          }}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ my: 2, borderRadius: 2, p: 1.25, fontSize: '1rem' }}
          disabled={!username || !password || loading}
        >
          {loading ? (
            <>
              <CircularProgress
                size="1em"
                color="inherit"
                sx={{ verticalAlign: 'middle', mr: 1 }}
              />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        message={error}
        severity="error"
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
}
