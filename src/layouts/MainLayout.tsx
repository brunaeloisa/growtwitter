import { Navigate, Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Link,
  Typography,
  Stack,
  MenuList,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { TrendingTopic } from '../components/TrendingTopic';
import { topics } from '../data/trendingTopics';
import logoDark from '../assets/logo-dark.svg';
import logoLight from '../assets/logo-light.svg';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { NavMenuItem } from '../components/NavMenuItem';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import ProfileDropdown from '../components/ProfileDropdown';
import { useAppSelector } from '../store/hooks';
import { useState } from 'react';
import TweetModal from '../components/TweetModal';

export function MainLayout() {
  const { user, token } = useAppSelector((state) => state.auth);
  const sidebarTopics = topics.slice(0, 5);
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        maxWidth: 1000,
        display: 'flex',
        mx: 'auto',
        minHeight: '100vh'
      }}
    >
      <Box
        component="aside"
        sx={{
          width: 200,
          p: 1,
          position: 'sticky',
          top: 0
        }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ height: '100%' }}
        >
          <Box sx={{ pr: 1 }}>
            <Box sx={{ pt: 1, pl: 1.5, display: 'block' }}>
              <img
                src={theme.palette.mode === 'dark' ? logoDark : logoLight}
                alt="growtweet"
                height={16}
              />
            </Box>
            <Box component="nav">
              <MenuList sx={{ py: 0.5 }}>
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
              onClick={() => setModalOpen(true)}
              variant="contained"
              color="primary"
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

      <Box
        component="main"
        sx={{
          flex: 1,
          borderLeft: 1,
          borderRight: 1,
          borderColor: 'divider'
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="aside"
        sx={{
          width: 300,
          p: 2,
          position: 'sticky',
          top: 0,
          display: { xs: 'none', lg: 'block' }
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Typography
            variant="body2"
            component="h2"
            sx={{ py: 1, px: 1.5, fontWeight: 800 }}
          >
            O que está acontecendo?
          </Typography>

          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {sidebarTopics.map((topic) => (
              <TrendingTopic
                key={topic.id}
                title={topic.title}
                category={topic.category}
                variant="sidebar"
              />
            ))}
          </Box>

          <Link
            component={RouterLink}
            to="/explore"
            underline="none"
            sx={{
              py: 1,
              px: 1.5,
              display: 'block',
              fontSize: 10,
              '&:hover': {
                color: 'primary.dark',
                backgroundColor: 'action.hover'
              }
            }}
          >
            Mostrar mais
          </Link>
        </Box>
      </Box>

      <TweetModal
        mode="NORMAL"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Container>
  );
}
