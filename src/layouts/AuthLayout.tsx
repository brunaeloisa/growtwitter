import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Box, Container, IconButton, Paper, useTheme } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import logoDark from '../assets/logo-dark.svg';
import logoLight from '../assets/logo-light.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/theme/theme.slice';

export function AuthLayout() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { user, token } = useAppSelector((state) => state.auth);

  if (user && token) {
    return <Navigate to="/" replace />;
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
              borderRadius: 2,
              position: 'relative'
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

            <Outlet />
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
