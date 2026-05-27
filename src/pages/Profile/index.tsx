import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { FollowButton } from '../../components/FollowButton';
import { FollowersModal } from '../../components/FollowersModal';
import { NavbarTop } from '../../components/NavbarTop';
import { TweetCard } from '../../components/TweetCard';
import {
  getFollowingUsers,
  getUserProfileById
} from '../../services/user.service';
import { useAppSelector } from '../../store/hooks';
import type { UserProfile } from '../../types/user.types';
import { StateView } from '../../components/StateView';

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
  const { id } = useParams<{ id: string }>();
  return <ProfilePage key={id} />;
}

function ProfilePage() {
  const loggedUser = useAppSelector((state) => state.auth.user);
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(
    null
  );

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

  useEffect(() => {
    if (!user || !isOwnProfile) return;

    const followingIds = user.following.map((user) => user.id);

    const hasDifferentFollowing =
      followingIds.some((id) => !followingList.includes(id)) ||
      followingList.some((id) => !followingIds.includes(id));

    if (hasDifferentFollowing) {
      getFollowingUsers().then((updatedFollowing) => {
        setUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            following: updatedFollowing
          };
        });
      });
    }
  }, [followingList, isOwnProfile, user]);

  const handleFollowChange = (isFollowing: boolean) => {
    if (!loggedUser) return;

    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        followers: isFollowing
          ? [...prev.followers, loggedUser]
          : prev.followers.filter((user) => user.id !== loggedUser.id)
      };
    });
  };

  return (
    <>
      <NavbarTop>
        <Stack
          direction="row"
          alignItems="center"
          sx={[
            { px: 1, minHeight: 'inherit' },
            user
              ? {
                  pb: '1px',
                  gap: 1,
                  boxShadow: (theme) =>
                    `0 1px 2px rgba(0, 0, 0, ${theme.palette.mode === 'dark' ? 0.4 : 0.08})`
                }
              : { borderBottom: 1, borderColor: 'divider' }
          ]}
        >
          <IconButton
            aria-label="Voltar"
            sx={{ p: 0.5 }}
            onClick={() => navigate(-1)}
          >
            <KeyboardBackspaceIcon fontSize="small" />
          </IconButton>

          {user && (
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
          )}
        </Stack>
      </NavbarTop>

      <StateView
        isLoading={loading}
        isEmpty={!user}
        fallback={'Usuário não encontrado.'}
      >
        {user && (
          <>
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
                <CropOriginalIcon
                  sx={{ color: 'common.white', fontSize: '54px' }}
                />
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
                  <ButtonBase
                    onClick={() => {
                      setOpenFollowersModal(true);
                      setModalType('following');
                    }}
                  >
                    <Typography
                      fontSize={10}
                      color="text.disabled"
                      sx={{ fontWeight: 500 }}
                    >
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, color: 'text.primary', pr: 0.5 }}
                      >
                        {user.following.length}
                      </Box>
                      Seguindo
                    </Typography>
                  </ButtonBase>

                  <ButtonBase
                    onClick={() => {
                      setOpenFollowersModal(true);
                      setModalType('followers');
                    }}
                  >
                    <Typography
                      fontSize={10}
                      color="text.disabled"
                      sx={{ fontWeight: 500 }}
                    >
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, color: 'text.primary', pr: 0.5 }}
                      >
                        {user.followers.length}
                      </Box>
                      Seguidores
                    </Typography>
                  </ButtonBase>
                </Stack>
              </Box>
            </Box>

            <StateView
              isLoading={false}
              isEmpty={user.tweets.length === 0}
              fallback={'Este perfil não possui nenhum growtweet.'}
              variant={'caption'}
            >
              <Stack
                divider={
                  <Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />
                }
              >
                {user.tweets.map((tweet) => (
                  <TweetCard
                    key={tweet.id}
                    tweet={tweet}
                    onDelete={loadProfile}
                  />
                ))}
              </Stack>

              <Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />
            </StateView>

            {modalType && (
              <FollowersModal
                open={openFollowersModal}
                onClose={() => setOpenFollowersModal(false)}
                title={modalType === 'followers' ? 'Seguidores' : 'Seguindo'}
                users={user[modalType]}
                followingList={followingList}
                setFollowingList={setFollowingList}
              />
            )}
          </>
        )}
      </StateView>
    </>
  );
}
