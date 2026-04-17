import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import { TrendingTopic } from '../../components/TrendingTopic';
import { topics } from '../../data/trendingTopics';
import { NavbarTop } from '../../components/NavbarTop';
import { useEffect, useRef, useState } from 'react';
import { TabPanel } from '../../components/TabPanel';
import type { User } from '../../types/user.types';
import { getUserList } from '../../services/user.service';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { FollowButton } from '../../components/FollowButton';
import { useAppSelector } from '../../store/hooks';

interface OutletContext {
  followingList: string[];
  setFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { followingList, setFollowingList } = useOutletContext<OutletContext>();

  const isLoaded = useRef(false);
  const loggedUserId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (isLoaded.current || followingList.length === 0) return;

    getUserList()
      .then((data) => {
        const currentFollowing = new Set(followingList.map((id) => String(id)));

        const filteredUsers = data.filter(
          (user: User) =>
            !currentFollowing.has(user.id) && user.id !== loggedUserId
        );

        setUsers(filteredUsers);

        if (data.length > 0) {
          isLoaded.current = true;
        }
      })
      .finally(() => setLoading(false));
  }, [followingList, loggedUserId]);

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

  function handleTabChange(_event: React.SyntheticEvent, newValue: number) {
    setTabValue(newValue);
  }

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
            users.map((user) => (
              <Stack
                key={user.id}
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                <Link
                  component={RouterLink}
                  to={`/profile/${user.id}`}
                  underline="none"
                  color="inherit"
                  sx={{ display: 'flex', gap: 1, minWidth: 0, flexGrow: 1 }}
                >
                  <Avatar
                    src={user.imageUrl ?? undefined}
                    sx={{
                      width: 40,
                      height: 40,
                      '& img': { bgcolor: 'background.paper' },
                      '&:hover': {
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                      }
                    }}
                  >
                    <CropOriginalIcon sx={{ color: 'common.white' }} />
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={800}
                      noWrap
                      sx={{
                        display: 'block',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {user.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      fontWeight={500}
                      color="text.disabled"
                      noWrap
                      sx={{
                        display: 'block',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      @{user.username}
                    </Typography>
                  </Box>
                </Link>

                <FollowButton
                  userId={user.id}
                  username={user.username}
                  followingList={followingList}
                  setFollowingList={setFollowingList}
                />
              </Stack>
            ))
          )}
        </Stack>
      </TabPanel>
    </>
  );
}
