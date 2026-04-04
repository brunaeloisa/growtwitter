import { Box, Stack, MenuList, Button } from '@mui/material';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PersonIcon from '@mui/icons-material/Person';

import { NavMenuItem } from './NavMenuItem';
import ProfileDropdown from './ProfileDropdown';

import logoDark from '../assets/logo-dark.svg';
import logoLight from '../assets/logo-light.svg';

import { useTheme } from '@mui/material/styles';
import type { User } from '../types/user.types';

interface SidebarProps {
  user: User;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseDrawer?: () => void;
}

export function Sidebar({ user, setModalOpen, onCloseDrawer }: SidebarProps) {
  const theme = useTheme();

  return (
    <Box
      component="aside"
      sx={{
        width: 200,
        p: 1,
        position: 'sticky',
        top: 0,
        height: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ height: '100%' }}
      >
        <Box sx={{ pr: 1 }}>
          <Box sx={{ pt: 1, pl: 1.5 }}>
            <img
              src={theme.palette.mode === 'dark' ? logoDark : logoLight}
              alt="growtweet"
              height={16}
            />
          </Box>

          <Box component="nav">
            <MenuList sx={{ py: 0.5 }} onClick={() => onCloseDrawer?.()}>
              <NavMenuItem
                to="/"
                icon={HomeOutlinedIcon}
                iconActive={HomeIcon}
                end
              >
                Página inicial
              </NavMenuItem>

              <NavMenuItem
                to="/explore"
                icon={TagIcon}
                iconActive={TagIcon}
                end
              >
                Explorar
              </NavMenuItem>

              <NavMenuItem
                to={`/profile/${user.id}`}
                icon={PersonOutlinedIcon}
                iconActive={PersonIcon}
              >
                Perfil
              </NavMenuItem>
            </MenuList>
          </Box>

          <Button
            onClick={() => {
              setModalOpen(true);
              onCloseDrawer?.();
            }}
            variant="contained"
            sx={{
              borderRadius: 10,
              mt: 1,
              width: '100%',
              fontWeight: 700
            }}
          >
            Tweetar
          </Button>
        </Box>

        <ProfileDropdown
          name={user.name}
          username={user.username}
          imageUrl={user.imageUrl}
        />
      </Stack>
    </Box>
  );
}
