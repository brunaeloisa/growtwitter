import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomSnackbar } from '../../components/CustomSnackbar';
import { loginThunk } from '../../store/auth/auth.thunk';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { AuthContextType } from '../../layouts/AuthLayout';
import { useLocation, useOutletContext } from 'react-router-dom';

export function Login() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const [username, setUsername] = useState(location.state?.username || '');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { setAuthPrompt } = useOutletContext<AuthContextType>();

  useEffect(() => {
    setAuthPrompt({
      text: 'Não tem uma conta?',
      linkText: 'Cadastre-se.',
      path: '/register'
    });
  }, [setAuthPrompt]);

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
