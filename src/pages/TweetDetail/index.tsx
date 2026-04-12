import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NavbarTop } from '../../components/NavbarTop';
import { useAppSelector } from '../../store/hooks';
import type { Tweet } from '../../types/tweet.types';
import { getTweetById } from '../../services/tweet.service';
import { TweetThread } from '../../components/TweetThread';
import { TweetCard } from '../../components/TweetCard';

export function TweetDetail() {
  const loggedUser = useAppSelector((state) => state.auth.user);
  const { id: tweetId } = useParams<{ id: string }>();
  const replyId = useSearchParams()[0].get('reply');
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [loading, setLoading] = useState(true);
  const [tweetRefreshKey, setTweetRefreshKey] = useState(0);
  const navigate = useNavigate();

  const loadTweet = useCallback(() => {
    if (!loggedUser?.id || !tweetId) return;

    getTweetById(tweetId, loggedUser.id)
      .then(setTweet)
      .finally(() => setLoading(false));
  }, [tweetId, loggedUser]);

  useEffect(() => {
    loadTweet();
  }, [loadTweet, tweetRefreshKey]);

  if (!loading && tweet && replyId) {
    const exists = tweet.replies?.some((r) => String(r.id) === replyId);

    if (!exists) {
      navigate(`/tweet/${tweetId}`, { replace: true });
      return null;
    }
  }

  return (
    <>
      <NavbarTop>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            px: 1,
            gap: 1,
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

          <Typography
            component="h1"
            variant="body2"
            sx={{
              py: { xs: 2, md: 1.5 },
              fontWeight: 800
            }}
          >
            Growtweet
          </Typography>
        </Stack>
      </NavbarTop>

      {loading ? (
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
          <CircularProgress size="1em" color="inherit" /> Carregando...
        </Typography>
      ) : !tweet ? (
        <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
          Growtweet não encontrado.
        </Typography>
      ) : (
        <>
          {replyId ? (
            <Box>
              <TweetThread
                key={tweet.id}
                tweet={tweet}
                onDelete={loadTweet}
                triggerRefresh={() => setTweetRefreshKey((prev) => prev + 1)}
                activeReplyId={replyId}
              />
            </Box>
          ) : (
            <Stack
              divider={
                <Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />
              }
            >
              <TweetCard
                tweet={tweet}
                triggerRefresh={() => setTweetRefreshKey((prev) => prev + 1)}
                onDelete={loadTweet}
                highlight={true}
              />

              {tweet.replies?.map((reply) => (
                <TweetCard
                  key={reply.id}
                  tweet={reply}
                  triggerRefresh={() => setTweetRefreshKey((prev) => prev + 1)}
                  onDelete={loadTweet}
                  replyTo={tweet.id}
                  parentAuthor={{
                    id: tweet.author.id,
                    username: tweet.author.username
                  }}
                />
              ))}
            </Stack>
          )}

          <Divider flexItem sx={{ borderBottomWidth: 1, my: 0 }} />
        </>
      )}
    </>
  );
}
