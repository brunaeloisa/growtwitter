import {
  Box,
  Container,
  Drawer,
  IconButton,
  Link,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, Link as RouterLink } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TrendingTopic } from '../components/TrendingTopic';
import TweetModal from '../components/TweetModal';
import { topics } from '../data/trendingTopics';
import { getUserData } from '../services/user.service';
import { useAppSelector } from '../store/hooks';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch } from '../store/hooks';
import { updateUserImage } from '../store/auth/auth.slice';

export function MainLayout() {
  const { user, token } = useAppSelector((state) => state.auth);
  const sidebarTopics = topics.slice(0, 5);
  const [modalOpen, setModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user?.id) return;

    getUserData(user.id).then(({ imageUrl, following }) => {
      setFollowingList(following);

      if (imageUrl) {
        dispatch(updateUserImage(imageUrl));
      }
    });
  }, [dispatch, user]);

  function handleTweetCreated() {
    if (location.pathname === `/profile/${user?.id}`) {
      setProfileRefreshKey((prev) => prev + 1);
    }

    setModalOpen(false);
  }

  function toggleDrawer(newOpen: boolean) {
    return () => setOpenMenu(newOpen);
  }

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
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <IconButton
        aria-label="Abrir menu"
        onClick={toggleDrawer(true)}
        sx={{
          display: { xs: 'inline-flex', md: 'none' },
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 30
        }}
      >
        <MenuIcon fontSize="small" />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={toggleDrawer(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Sidebar
          user={user}
          setModalOpen={setModalOpen}
          onCloseDrawer={toggleDrawer(false)}
        />
      </Drawer>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar user={user} setModalOpen={setModalOpen} />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          borderLeft: 1,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'auto',
          height: '100%'
        }}
      >
        <Outlet
          context={{ profileRefreshKey, followingList, setFollowingList }}
        />
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
        onTweetCreated={handleTweetCreated}
      />
    </Container>
  );
}
