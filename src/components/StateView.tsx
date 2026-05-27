import { CircularProgress, Typography } from '@mui/material';
import { isValidElement } from 'react';

interface StateViewProps {
  isLoading: boolean;
  isEmpty: boolean;
  fallback: React.ReactNode;
  variant?: 'body2' | 'caption';
  children: React.ReactNode;
}

export function StateView({
  isLoading,
  isEmpty,
  fallback,
  variant = 'body2',
  children
}: StateViewProps) {
  if (isLoading) {
    return (
      <Typography
        variant={variant}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75
        }}
      >
        <CircularProgress size="1em" color="inherit" /> Carregando...
      </Typography>
    );
  }

  if (isEmpty) {
    if (isValidElement(fallback)) return fallback;

    return (
      <Typography
        variant={variant}
        sx={{ p: 2, textAlign: 'center', display: 'block' }}
      >
        {fallback}
      </Typography>
    );
  }

  return <>{children}</>;
}
