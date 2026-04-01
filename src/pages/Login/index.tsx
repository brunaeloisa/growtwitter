import { loginThunk } from '../../store/auth/auth.thunk';
import { Navigate } from 'react-router-dom';
import { toggleTheme } from '../../store/theme/theme.slice';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useState } from 'react';

export function Login() {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginThunk({ username, password }));
  }

  function handleThemeToggle() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <Container maxWidth="sm">
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
            sx={{
              p: 4,
              width: '90%',
              borderRadius: 2
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 4 }}
            >
              Growtwitter
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Usuário"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={!username || !password}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            {error && (
              <Typography
                variant="body2"
                component="p"
                align="center"
                sx={{ mt: 1, color: 'error.main' }}
              >
                {error}
              </Typography>
            )}
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
    </>
  );
}
