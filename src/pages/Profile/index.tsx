import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { getUserProfileById } from '../../services/user.service';
import { useParams } from 'react-router-dom';
import type { UserProfile } from '../../types/user.types';
import {
  Box,
  Divider,
  Stack,
  Typography,
  IconButton,
  Avatar,
  Button
} from '@mui/material';
import { TweetCard } from '../../components/TweetCard';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Link as RouterLink } from 'react-router-dom';

function formatAccountCreationDate(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric'
  };

  return date.toLocaleDateString('pt-BR', options);
}

export function Profile() {
  const loggedUser = useAppSelector((state) => state.auth.user);
  const { id: userId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loggedUser?.id || !userId) return;

    getUserProfileById(userId, loggedUser.id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId, loggedUser?.id]);

  if (loading) {
    return (
      <Typography variant="body2" sx={{ p: 1.5, textAlign: 'center' }}>
        Carregando...
      </Typography>
    );
  }

  if (!user) {
    return (
      <Typography variant="body2" sx={{ p: 1.5, textAlign: 'center' }}>
        Usuário não encontrado.
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ px: 1, py: 1.5, gap: 1 }}
        >
          <IconButton
            aria-label="Voltar para Página Inicial"
            sx={{ p: 0.5 }}
            component={RouterLink}
            to="/"
          >
            <KeyboardBackspaceIcon fontSize="small" />
          </IconButton>

          <Box>
            <Typography component="h1" variant="body2" sx={{ fontWeight: 800 }}>
              {user.name}
            </Typography>

            <Typography
              fontSize={10}
              lineHeight={1}
              color="text.disabled"
              sx={{ fontWeight: 500 }}
            >
              {user.tweets.length} growtweet{user.tweets.length > 1 && 's'}
            </Typography>
          </Box>
        </Stack>

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
          <CropOriginalIcon fontSize="small" sx={{ color: '#ffffff' }} />
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

            {userId !== loggedUser?.id && (
              <Button
                variant="contained"
                sx={{
                  height: 32,
                  borderRadius: 5,
                  backgroundColor: 'text.primary',
                  color: 'background.default',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'text.secondary'
                  }
                }}
              >
                Seguir
              </Button>
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
        divider={
          <Divider
            flexItem
            sx={{
              borderBottomWidth: 1,
              my: 0
            }}
          />
        }
      >
        {user?.tweets.length ? (
          user?.tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        ) : (
          <Typography variant="caption" sx={{ p: 2, textAlign: 'center' }}>
            Este perfil não possui nenhum growtweet.
          </Typography>
        )}
      </Stack>
    </>
  );
}
