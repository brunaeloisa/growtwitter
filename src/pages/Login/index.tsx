import { loginThunk } from '../../store/auth/auth.thunk';
import { Navigate } from 'react-router-dom';
import { toggleTheme } from '../../store/theme/theme.slice';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import logoDark from '../../assets/logo-dark.svg';
import logoLight from '../../assets/logo-light.svg';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useState } from 'react';
import { CustomSnackbar } from '../../components/CustomSnackbar';

export function Login() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { user, token, loading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await dispatch(loginThunk({ username, password })).unwrap();
    } catch {
      setSnackbarOpen(true);
    }
  }

  function handleThemeToggle() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ p: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paper
            elevation={3}
            aria-label="Entrar no GrowTwitter"
            sx={{
              p: { xs: 3, sm: 4 },
              width: '90%',
              borderRadius: 2
            }}
          >
            <Box sx={{ textAlign: 'center', p: 1, mb: { xs: 0, sm: 1.5 } }}>
              <Box
                component="img"
                src={theme.palette.mode === 'dark' ? logoDark : logoLight}
                alt="growtweet"
                sx={{ height: { xs: 30, sm: 40 }, maxWidth: '100%' }}
              />
            </Box>

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
          </Paper>
        </Box>
      </Container>

      <IconButton
        aria-label="Trocar tema"
        onClick={handleThemeToggle}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <Brightness4Icon />
      </IconButton>

      <CustomSnackbar
        open={snackbarOpen}
        message={error}
        severity="error"
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
}
