import { Alert, Snackbar, type AlertColor } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  severity: AlertColor;
  message: string | null;
}

export function CustomSnackbar({
  open,
  onClose,
  severity,
  message
}: CustomSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', color: 'common.white' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
