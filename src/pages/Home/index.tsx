import { Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchFeed } from '../../services/tweet.service';
import { useAppSelector } from '../../store/hooks';
import type { Tweet } from '../../types/tweet.types';
import { TweetThread } from '../../components/TweetThread';

export function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    fetchFeed(user.id)
      .then(setTweets)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <>
      <Typography
        component="h1"
        variant="body2"
        sx={{
          p: 1.5,
          fontWeight: 800,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        Página Inicial
      </Typography>

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
        {loading ? (
          <Typography variant="body2" sx={{ p: 1.5, textAlign: 'center' }}>
            Carregando...
          </Typography>
        ) : tweets.length ? (
          tweets.map((tweet) => <TweetThread key={tweet.id} tweet={tweet} />)
        ) : (
          <Typography variant="body2" sx={{ p: 1.5, textAlign: 'center' }}>
            Nada por aqui ainda. Siga pessoas para ver growtweets no seu feed!
          </Typography>
        )}
      </Stack>
    </>
  );
}
