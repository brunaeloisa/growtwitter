import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { getUserProfileById } from '../../services/user.service';
import { useNavigate, useParams } from 'react-router-dom';
import type { UserProfile } from '../../types/user.types';
import {
  Box,
  Divider,
  Stack,
  Typography,
  IconButton,
  Avatar,
  CircularProgress
} from '@mui/material';
import { TweetCard } from '../../components/TweetCard';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useOutletContext } from 'react-router-dom';
import { NavbarTop } from '../../components/NavbarTop';
import { FollowButton } from '../../components/FollowButton';

function formatAccountCreationDate(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric'
  };

  return date.toLocaleDateString('pt-BR', options);
}

interface OutletContext {
  followingList: string[];
  setFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
  profileRefreshKey: number;
}

export function Profile() {
  const loggedUser = useAppSelector((state) => state.auth.user);
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { followingList, setFollowingList, profileRefreshKey } =
    useOutletContext<OutletContext>();

  const isOwnProfile = loggedUser?.id === userId;

  const loadProfile = useCallback(() => {
    if (!loggedUser?.id || !userId) return;

    getUserProfileById(userId, loggedUser.id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId, loggedUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile, profileRefreshKey]);

  const handleFollowChange = (isFollowing: boolean) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        followersCount: prev.followersCount + (isFollowing ? 1 : -1)
      };
    });
  };

  if (!user) {
    return (
      <>
        <NavbarTop>
          <Box
            sx={{
              px: 1,
              minHeight: 'inherit',
              display: 'flex',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <IconButton
              aria-label="Voltar"
              sx={{ p: 0.5 }}
              onClick={() => navigate(-1)}
            >
              <KeyboardBackspaceIcon fontSize="small" />
            </IconButton>
          </Box>
        </NavbarTop>

        <Typography
          variant="body2"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75
          }}
        >
          {loading ? (
            <>
              <CircularProgress size="1em" color="inherit" /> Carregando...
            </>
          ) : (
            'Usuário não encontrado.'
          )}
        </Typography>
      </>
    );
  }

  return (
    <>
      <NavbarTop>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            px: 1,
            pb: '1px',
            gap: 1,
            minHeight: 'inherit',
            boxShadow: (theme) =>
              `0 1px 2px rgba(0, 0, 0, ${theme.palette.mode === 'dark' ? 0.4 : 0.08})`
          }}
        >
          <IconButton
            aria-label="Voltar"
            sx={{ p: 0.5 }}
            onClick={() => navigate(-1)}
          >
            <KeyboardBackspaceIcon fontSize="small" />
          </IconButton>

          <Box sx={{ minWidth: 0, flex: 1, pr: { xs: '40px', md: 0 } }}>
            <Typography
              component="h1"
              variant="body2"
              sx={{
                fontWeight: 800,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block'
              }}
            >
              {user.name}
            </Typography>

            <Typography
              fontSize={10}
              lineHeight={1}
              color="text.disabled"
              sx={{ fontWeight: 500 }}
            >
              {user.tweets.length} growtweet{user.tweets.length !== 1 && 's'}
            </Typography>
          </Box>
        </Stack>
      </NavbarTop>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            height: 130,
            backgroundColor: 'background.paper',
            marginBottom: '-50px'
          }}
        ></Box>

        <Avatar
          src={user.imageUrl ?? undefined}
          sx={{
            width: 100,
            height: 100,
            border: 3.5,
            marginLeft: 1.5,
            borderColor: 'background.default',
            '& img': {
              bgcolor: 'background.paper'
            }
          }}
        >
          <CropOriginalIcon sx={{ color: 'common.white', fontSize: '54px' }} />
        </Avatar>

        <Box sx={{ px: 2, p: 1.5 }}>
          <Stack
            direction="row"
            sx={{ pb: 1.5, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {user.name}
              </Typography>

              <Typography
                fontSize={10}
                color="text.disabled"
                sx={{ fontWeight: 500 }}
              >
                @{user.username}
              </Typography>
            </Box>

            {!isOwnProfile && (
              <FollowButton
                userId={user.id}
                username={user.username}
                followingList={followingList}
                setFollowingList={setFollowingList}
                onToggleFollow={handleFollowChange}
              />
            )}
          </Stack>

          <Typography
            fontSize={10}
            color="text.disabled"
            sx={{ fontWeight: 500 }}
          >
            <CalendarMonthOutlinedIcon
              sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'center' }}
            />
            Ingressou em {formatAccountCreationDate(user.createdAt)}
          </Typography>

          <Stack direction="row" gap={2} pt={1.5} pb={1} ml={0.3}>
            <Typography
              fontSize={10}
              color="text.disabled"
              sx={{ fontWeight: 500 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 600, color: 'text.primary', pr: 0.5 }}
              >
                {user.followingCount}
              </Box>
              Seguindo
            </Typography>

            <Typography
              fontSize={10}
              color="text.disabled"
              sx={{ fontWeight: 500 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 600, color: 'text.primary', pr: 0.5 }}
              >
                {user.followersCount}
              </Box>
              Seguidores
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Stack
        divider={<Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />}
      >
        {user.tweets.length ? (
          user.tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} onDelete={loadProfile} />
          ))
        ) : (
          <Typography variant="caption" sx={{ p: 2, textAlign: 'center' }}>
            Este perfil não possui nenhum growtweet.
          </Typography>
        )}
      </Stack>

      {user.tweets.length > 0 && (
        <Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />
      )}
    </>
  );
}
