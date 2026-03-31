import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import type { Tweet } from '../types/tweet.types';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { likeTweet, unlikeTweet } from '../services/tweet.service';
import { useState } from 'react';

function formatTimePost(dateString: string) {
  const now = Date.now();
  const postDate = new Date(dateString);
  const diff = now - postDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  const currentYear = new Date().getFullYear();
  const postYear = postDate.getFullYear();

  const options: Intl.DateTimeFormatOptions =
    currentYear === postYear
      ? { day: 'numeric', month: 'short' }
      : { day: 'numeric', month: 'short', year: '2-digit' };

  return postDate.toLocaleDateString('pt-BR', options).replace(/ de /g, ' ');
}

export function TweetCard({ tweet }: { tweet: Tweet }) {
  const [liked, setLiked] = useState(tweet.likedByUser);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    const prevCount = likesCount;

    setLiked(!liked);
    setLikesCount((prev: number) => (liked ? prev - 1 : prev + 1));

    const success = liked
      ? await unlikeTweet(tweet.id)
      : await likeTweet(tweet.id);

    if (!success) {
      setLiked(!liked);
      setLikesCount(prevCount);
    }

    setLoading(false);
  };

  return (
    <>
      <Stack direction="row" gap={1} sx={{ p: 1 }}>
        <Avatar
          src={tweet.author.imageUrl ?? undefined}
          sx={{ width: 40, height: 40, bgcolor: 'background.paper' }}
        >
          <CropOriginalIcon sx={{ color: '#ffffff' }} />
        </Avatar>

        <Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Typography variant="caption" fontWeight={800}>
              {tweet.author.name}
            </Typography>

            <Typography
              variant="caption"
              fontWeight={500}
              color="text.disabled"
            >
              @{tweet.author.username}
            </Typography>

            <Typography variant="caption" color="text.disabled">
              • {formatTimePost(tweet.createdAt)}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" component="div">
            {tweet.content}
          </Typography>

          <Stack direction="row" marginTop={0.5} gap={3}>
            {tweet.replies && (
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 'auto',
                  gap: 0.5,
                  p: 0,
                  color: 'text.disabled',

                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">
                  {tweet.replies.length ?? 0}
                </Typography>
              </Button>
            )}

            <Button
              onClick={handleLike}
              sx={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 'auto',
                gap: 0.5,
                p: 0,
                color: liked ? 'error.main' : 'text.disabled',

                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'transparent'
                }
              }}
            >
              {liked ? (
                <FavoriteIcon sx={{ fontSize: 14 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 14 }} />
              )}

              <Typography variant="caption" color="inherit">
                {likesCount}
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
