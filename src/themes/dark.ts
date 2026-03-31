import { createTheme } from '@mui/material';

export const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1d9bf0',
      dark: '#1588d7',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0b0707',
      paper: '#16181c'
    },
    text: {
      primary: '#ffffff',
      secondary: '#f2f2f2',
      disabled: '#626161'
    },
    action: {
      hover: '#1f2227'
    },
    divider: '#3c3b3b'
  },

  typography: {
    fontFamily: 'Karla, Arial, sans-serif',
    button: {
      textTransform: 'none'
    }
  },

  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none'
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: 'none',
          '&:hover, &:active, &:focus': {
            boxShadow: 'none'
          }
        }
      }
    }
  }
});
