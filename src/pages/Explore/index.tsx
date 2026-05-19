import {
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { NavbarTop } from '../../components/NavbarTop';
import { TabPanel } from '../../components/TabPanel';
import { TrendingTopic } from '../../components/TrendingTopic';
import { UserList } from '../../components/UserList';
import { topics } from '../../data/trendingTopics';
import { getUserList } from '../../services/user.service';
import { useAppSelector } from '../../store/hooks';
import type { User } from '../../types/user.types';

interface OutletContext {
  followingList: string[];
  setFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
  isFollowingLoaded: boolean;
}

const tabStyle = {
  fontSize: '12px',
  fontWeight: 700,
  minHeight: '32px',
  height: '100%',
  p: 0,
  color: 'text.disabled',
  flex: 1
};

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { followingList, setFollowingList, isFollowingLoaded } =
    useOutletContext<OutletContext>();
  const hasFetchedUsers = useRef(false);
  const loggedUserId = useAppSelector((state) => state.auth.user?.id);
  const tabValue = searchParams.get('tab') === 'who-to-follow' ? 1 : 0;

  useEffect(() => {
    if (!isFollowingLoaded || hasFetchedUsers.current) return;

    getUserList()
      .then((data) => {
        const currentFollowing = new Set(followingList.map((id) => String(id)));

        const filteredUsers = data.filter(
          (user: User) =>
            !currentFollowing.has(user.id) && user.id !== loggedUserId
        );

        setUsers(filteredUsers);
        hasFetchedUsers.current = true;
      })
      .finally(() => setLoading(false));
  }, [followingList, isFollowingLoaded, loggedUserId]);

  const activeLabel = (texto: string, active: boolean) => (
    <Box sx={{ position: 'relative', display: 'inline-block', px: 0.5 }}>
      {texto}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          right: 0,
          width: active ? '100%' : 0,
          transition: 'width 0.25s ease',
          height: '2px',
          backgroundColor: 'primary.main',
          borderRadius: '2px 2px 0 0'
        }}
      />
    </Box>
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSearchParams(newValue === 1 ? { tab: 'who-to-follow' } : {}, {
      replace: true
    });
  };

  function accessibilityProps(index: number) {
    return {
      id: `explore-tab-${index}`,
      'aria-controls': `explore-tabpanel-${index}`
    };
  }

  return (
    <>
      <NavbarTop positionMd="static" solid>
        <Box
          sx={{
            minHeight: 'inherit',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            pb: '1px'
          }}
        >
          <Typography component="h1" variant="body2" sx={{ fontWeight: 800 }}>
            Explorar
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Explorar"
          variant="fullWidth"
          textColor="inherit"
          slotProps={{
            indicator: {
              sx: {
                display: { xs: 'flex', sm: 'none' }
              }
            }
          }}
          sx={{
            borderBottom: 1,
            mt: -1,
            borderColor: 'divider',
            minHeight: '32px',
            height: '32px',
            '& .MuiTab-root': tabStyle,
            '& .MuiTab-root:hover': {
              bgcolor: 'background.paper'
            },
            '& .Mui-selected': {
              color: 'text.primary'
            }
          }}
        >
          <Tab
            label={activeLabel('Para você', tabValue === 0)}
            {...accessibilityProps(0)}
          />

          <Tab
            label={activeLabel('Seguir', tabValue === 1)}
            {...accessibilityProps(1)}
          />
        </Tabs>
      </NavbarTop>

      <TabPanel value={tabValue} index={0} prefix="explore">
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 0.5 }}>
          {topics.map((topic) => (
            <TrendingTopic
              key={topic.id}
              title={topic.title}
              category={topic.category}
            ></TrendingTopic>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1} prefix="explore">
        <Stack direction="column">
          {loading ? (
            <Typography
              variant="body2"
              sx={{
                p: 2,
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75
              }}
            >
              <CircularProgress size="14px" color="inherit" /> Carregando...
            </Typography>
          ) : users.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 2, textAlign: 'center' }}
            >
              Não há novos usuários para seguir no momento.
            </Typography>
          ) : (
            <UserList
              users={users}
              followingList={followingList}
              setFollowingList={setFollowingList}
            />
          )}
        </Stack>
      </TabPanel>
    </>
  );
}
