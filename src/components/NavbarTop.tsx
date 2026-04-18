import { Stack } from '@mui/material';

interface NavbarTopProps {
  children: React.ReactNode;
  positionMd?: 'sticky' | 'static';
  solid?: boolean;
}

export function NavbarTop({
  children,
  positionMd = 'sticky',
  solid = false
}: NavbarTopProps) {
  return (
    <Stack
      direction="column"
      sx={{
        position: { xs: 'sticky', md: positionMd },
        top: 0,
        zIndex: 20,
        minHeight: { xs: 49, md: 45 },
        overflow: 'visible',
        ...(solid
          ? { bgcolor: 'background.default' }
          : {
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(11, 7, 7, 0.65)'
                  : 'rgba(255, 255, 255, 0.65)'
            })
      }}
    >
      {children}
    </Stack>
  );
}
