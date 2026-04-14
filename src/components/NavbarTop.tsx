import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface NavbarTopProps {
  children: ReactNode;
  positionMd?: 'sticky' | 'static';
}

export function NavbarTop({ children, positionMd = 'sticky' }: NavbarTopProps) {
  return (
    <Box
      sx={{
        position: { xs: 'sticky', md: positionMd },
        top: 0,
        zIndex: 20,
        height: { xs: 49, md: 45 },
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(11, 7, 7, 0.65)'
            : 'rgba(255, 255, 255, 0.65)'
      }}
    >
      {children}
    </Box>
  );
}
