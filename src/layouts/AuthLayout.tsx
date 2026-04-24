import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Link
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/theme/theme.slice';
import logoDark from '../assets/logo-dark.svg';
import logoLight from '../assets/logo-light.svg';
import { Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface AuthPrompt {
  text: string;
  linkText: string;
  path: string;
}

export interface AuthContextType {
  setAuthPrompt: React.Dispatch<React.SetStateAction<AuthPrompt>>;
}

export function AuthLayout() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { user, token } = useAppSelector((state) => state.auth);
  const [AuthPrompt, setAuthPrompt] = useState({
    text: '',
    linkText: '',
    path: ''
  });

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

            <Outlet context={{ setAuthPrompt } satisfies AuthContextType} />

            {AuthPrompt.text && (
              <Typography
                sx={{
                  fontSize: 14,
                  position: 'absolute',
                  bottom: -32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {AuthPrompt.text}{' '}
                <Link component={RouterLink} to={AuthPrompt.path}>
                  {AuthPrompt.linkText}
                </Link>
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
