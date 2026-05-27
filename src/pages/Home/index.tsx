import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchFeed } from '../../services/tweet.service';
import { useAppSelector } from '../../store/hooks';
import type { Tweet } from '../../types/tweet.types';
import { TweetThread } from '../../components/TweetThread';
import { NavbarTop } from '../../components/NavbarTop';
import { Link as RouterLink } from 'react-router-dom';
import { StateView } from '../../components/StateView';

const EmptyFeed = (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Nada por aqui ainda. Siga pessoas para ver growtweets no seu feed!
    </Typography>

    <Button
      component={RouterLink}
      to="/explore?tab=who-to-follow"
      variant="outlined"
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: '600'
      }}
    >
      Encontrar pessoas
    </Button>
  </Box>
);

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
      <NavbarTop positionMd="static">
        <Box
          sx={{
            minHeight: 'inherit',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Typography component="h1" variant="body2" sx={{ fontWeight: 800 }}>
            Página Inicial
          </Typography>
        </Box>
      </NavbarTop>

      <StateView
        isLoading={loading && tweets.length === 0}
        isEmpty={tweets.length === 0}
        fallback={EmptyFeed}
      >
        <Stack
          divider={<Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />}
        >
          {tweets.map((tweet) => (
            <TweetThread
              key={tweet.id}
              tweet={tweet}
              onDelete={loadTweets}
              triggerRefresh={() => setFeedRefreshKey((prev) => prev + 1)}
            />
          ))}
        </Stack>

        <Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />
      </StateView>
    </>
  );
}
