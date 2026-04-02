import { Divider, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchFeed } from '../../services/tweet.service';
import { useAppSelector } from '../../store/hooks';
import type { Tweet } from '../../types/tweet.types';
import { TweetThread } from '../../components/TweetThread';

export function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

  const loadTweets = useCallback(async () => {
    if (!user?.id) return;

    fetchFeed(user.id)
      .then(setTweets)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    loadTweets();
  }, [loadTweets, feedRefreshKey]);

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
        {loading && tweets.length === 0 ? (
          <Typography variant="body2" sx={{ p: 1.5, textAlign: 'center' }}>
            Carregando...
          </Typography>
        ) : tweets.length ? (
          tweets.map((tweet) => (
            <TweetThread
              key={tweet.id}
              tweet={tweet}
              onDelete={loadTweets}
              triggerRefresh={() => setFeedRefreshKey((prev) => prev + 1)}
            />
          ))
        ) : (
          <Typography variant="body2" sx={{ p: 1.5, textAlign: 'center' }}>
            Nada por aqui ainda. Siga pessoas para ver growtweets no seu feed!
          </Typography>
        )}
      </Stack>
    </>
  );
}
