import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import type { AuthContextType } from '../../layouts/AuthLayout';
import { useAppSelector } from '../../store/hooks';
import { register } from '../../services/auth.service';
import { CustomSnackbar } from '../../components/CustomSnackbar';
import type { ResponseRegister } from '../../types/auth.types';

export function Register() {
  const { user, token } = useAppSelector((state) => state.auth);
  const { setAuthPrompt } = useOutletContext<AuthContextType>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>();
  const [status, setStatus] = useState<ResponseRegister | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    imageUrl: ''
  });

  const imageError = formData.imageUrl?.trim().length > 0 && !preview;
  const nameError = formData.name.length > 0 && formData.name.trim().length < 3;
  const usernameError =
    formData.username.length > 0 && formData.username.trim().length < 3;
  const passwordError =
    formData.password.length > 0 && formData.password.length < 5;
  const isMissingFields =
    !formData.name.trim() || !formData.username.trim() || !formData.password;

  const isFormInvalid =
    isMissingFields ||
    usernameError ||
    nameError ||
    passwordError ||
    imageError;

  const inputProps = {
    fullWidth: true,
    variant: 'outlined' as const,
    margin: 'normal' as const,
    onChange: handleChange,
    disabled: loading
  };

  useEffect(() => {
    setAuthPrompt({
      text: 'Já tem uma conta?',
      linkText: 'Faça login.',
      path: '/login'
    });
  }, [setAuthPrompt]);

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const registerData = {
      username: formData.username.trim().toLowerCase(),
      name: formData.name.trim(),
      password: formData.password,
      imageUrl: preview
    };

    const result = await register(registerData);
    setStatus(result);
    setOpenSnackbar(true);

    if (result.success) {
      setTimeout(() => {
        navigate('/login', { state: { username: registerData.username } });
      }, 2000);
    }

    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'imageUrl') {
      setPreview(undefined);

      if (!value.trim()) return;

      const img = new Image();

      img.src = value.trim();
      img.onload = () => setPreview(img.src);
      img.onerror = () => setPreview(undefined);
    }
  }

  return (
    <>
      <Box component="form" onSubmit={handleRegister}>
        <TextField
          {...inputProps}
          required
          type="text"
          label="Usuário"
          name="username"
          error={usernameError}
        />

        <TextField
          {...inputProps}
          required
          type={showPassword ? 'text' : 'password'}
          label="Senha"
          name="password"
          error={passwordError}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />

        <TextField
          {...inputProps}
          required
          type="text"
          label="Nome"
          name="name"
          error={nameError}
        />

        <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1.5 }}>
          <Avatar
            src={preview}
            sx={{
              my: 1,
              width: { xs: 50, sm: 70 },
              height: { xs: 50, sm: 70 },
              '& img': { bgcolor: 'background.paper' }
            }}
          >
            <CropOriginalIcon
              sx={{ color: 'common.white', fontSize: { xs: 32, sm: 45 } }}
            />
          </Avatar>

          <TextField
            {...inputProps}
            type="text"
            label="Foto de perfil (URL)"
            name="imageUrl"
            error={imageError}
            placeholder="URL"
          />
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ my: 2, borderRadius: 2, p: 1.25, fontSize: '1rem' }}
          disabled={isFormInvalid || loading}
        >
          {loading ? (
            <>
              <CircularProgress
                size="1em"
                color="inherit"
                sx={{ verticalAlign: 'middle', mr: 1 }}
              />
              Cadastrando...
            </>
          ) : (
            'Cadastrar'
          )}
        </Button>
      </Box>

      <CustomSnackbar
        open={openSnackbar}
        message={status?.message || ''}
        severity={status?.success ? 'success' : 'error'}
        onClose={() => setOpenSnackbar(false)}
      />
    </>
  );
}
