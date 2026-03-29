import { createTheme } from '@mui/material';

export const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d9bf0',
      dark: '#1588d7',
      contrastText: '#ffffff'
    },
    background: {
      default: '#ffffff',
      paper: '#e9e9e9'
    },
    text: {
      primary: '#333333',
      secondary: '#4f4f4f',
      disabled: '#828282'
    },
    action: {
      hover: '#bdbdbd'
    },
    divider: '#e0e0e0'
  },

  typography: {
    fontFamily: 'Karla, Arial, sans-serif',
    button: {
      textTransform: 'none'
    }
  }
});
