import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import themes from './themes';
import { useAppSelector } from './store/hooks';

function App() {
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
