import {
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useLocation,
  useOutletContext,
  useSearchParams
} from 'react-router-dom';
import { NavbarTop } from '../../components/NavbarTop';
import { TabPanel } from '../../components/TabPanel';
import { TrendingTopic } from '../../components/TrendingTopic';
import { UserList } from '../../components/UserList';
import { topics } from '../../data/trendingTopics';
import { getUserList } from '../../services/user.service';
import { useAppSelector } from '../../store/hooks';
import type { User } from '../../types/user.types';
import { SearchInput } from '../../components/SearchInput';

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
  const loggedUserId = useAppSelector((state) => state.auth.user?.id);

  const location = useLocation();
  const initialSearch = location.state?.query ?? '';
  const [searchInput, setSearchInput] = useState(initialSearch);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [followSuggestions, setFollowSuggestions] = useState<User[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabValue =
    tabParam === 'who-to-follow' ? 1 : tabParam === 'search' ? 2 : 0;

  const { followingList, setFollowingList, isFollowingLoaded } =
    useOutletContext<OutletContext>();

  const hasFetchedUsers = useRef(false);

  useEffect(() => {
    if (!isFollowingLoaded || hasFetchedUsers.current) return;

    getUserList()
      .then((data) => {
        setUsers(data);

        const currentFollowing = new Set(followingList.map((id) => String(id)));
        const notFollowedUsers = data.filter(
          (user: User) =>
            !currentFollowing.has(user.id) && user.id !== loggedUserId
        );

        setFollowSuggestions(notFollowedUsers);
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

  const filteredUsers = useMemo(() => {
    const searchTerm = searchInput.toLowerCase().trim();
    if (searchTerm === '') return [];

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
    );
  }, [users, searchInput]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const tabMap: Record<number, string> = {
      1: 'who-to-follow',
      2: 'search'
    };

    const tabParam = tabMap[newValue];
    setSearchParams(tabParam ? { tab: tabParam } : {}, { replace: true });
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
            label={activeLabel('Em alta', tabValue === 0)}
            {...accessibilityProps(0)}
          />

          <Tab
            label={activeLabel('Sugestões', tabValue === 1)}
            {...accessibilityProps(1)}
          />

          <Tab
            label={activeLabel('Buscar', tabValue === 2)}
            {...accessibilityProps(2)}
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
          ) : followSuggestions.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 2, textAlign: 'center' }}
            >
              Não há novos usuários para seguir no momento.
            </Typography>
          ) : (
            <UserList
              users={followSuggestions}
              followingList={followingList}
              setFollowingList={setFollowingList}
            />
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={2} prefix="explore">
        <Stack direction="column">
          <Box sx={{ p: 1.5, pt: 2 }}>
            <SearchInput value={searchInput} onValueChange={setSearchInput} />
          </Box>

          {loading ? (
            <Typography
              variant="body2"
              sx={{
                p: 1.5,
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75
              }}
            >
              <CircularProgress size="14px" color="inherit" /> Carregando...
            </Typography>
          ) : filteredUsers.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 1.5, textAlign: 'center' }}
            >
              Nenhum usuário encontrado.
            </Typography>
          ) : (
            <UserList
              users={filteredUsers}
              followingList={followingList}
              setFollowingList={setFollowingList}
            />
          )}
        </Stack>
      </TabPanel>
    </>
  );
}
