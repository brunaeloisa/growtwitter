import MenuIcon from '@mui/icons-material/Menu';
import { Box, Container, Drawer, IconButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import ExploreAside from '../components/ExploreAside';
import { Sidebar } from '../components/Sidebar';
import TweetModal from '../components/TweetModal';
import { getUserData } from '../services/user.service';
import { updateUserImage } from '../store/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function MainLayout() {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [isFollowingLoaded, setIsFollowingLoaded] = useState(false);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

  const showAside = useLocation().pathname !== '/explore';

  useEffect(() => {
    if (!user?.id) return;

    getUserData(user.id).then(({ imageUrl, following }) => {
      setFollowingList(following);
      setIsFollowingLoaded(true);

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
          top: 6,
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
          context={{
            profileRefreshKey,
            followingList,
            setFollowingList,
            isFollowingLoaded
          }}
        />
      </Box>

      <Stack
        component="aside"
        sx={{
          width: 300,
          p: 2,
          position: 'sticky',
          top: 0,
          display: { xs: 'none', lg: 'flex' },
          gap: 2
        }}
      >
        {showAside && <ExploreAside />}
      </Stack>

      <TweetModal
        mode="NORMAL"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onTweetCreated={handleTweetCreated}
      />
    </Container>
  );
}
