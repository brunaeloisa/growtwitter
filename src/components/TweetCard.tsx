import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import type { Tweet } from '../types/tweet.types';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteTweet, likeTweet, unlikeTweet } from '../services/tweet.service';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TweetModal from './TweetModal';
import { useAppSelector } from '../store/hooks';

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

export interface TweetCardProps {
  tweet: Tweet;
  onDelete: () => void;
}

export function TweetCard({ tweet, onDelete }: TweetCardProps) {
  const [liked, setLiked] = useState(tweet.likedByUser);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyToTweetId, setReplyToTweetId] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const loggedUser = useAppSelector((state) => state.auth.user);
  const isAuthor = tweet.author.id === loggedUser?.id;

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    minWidth: 'auto',
    gap: 0.5,
    p: 0,
    color: 'text.disabled',
    bgcolor: 'transparent'
  };

  async function handleLike() {
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
  }

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir este tweet?')) return;
    const success = await deleteTweet(tweet.id);

    if (success) {
      onDelete();
    } else {
      setSnackbar({
        open: true,
        message: 'Erro ao excluir tweet. Tente novamente!'
      });
    }
  }

  return (
    <>
      <Stack direction="row" gap={1} sx={{ p: 1 }}>
        <Link
          component={RouterLink}
          to={`/profile/${tweet.author.id}`}
          underline="none"
          color="inherit"
        >
          <Avatar
            src={tweet.author.imageUrl ?? undefined}
            sx={{
              width: 40,
              height: 40,
              '& img': { bgcolor: 'background.paper' }
            }}
          >
            <CropOriginalIcon sx={{ color: '#ffffff' }} />
          </Avatar>
        </Link>

        <Box>
          <Link
            component={RouterLink}
            to={`/profile/${tweet.author.id}`}
            underline="none"
            color="inherit"
          >
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
          </Link>

          <Typography variant="caption" color="text.secondary" component="div">
            {tweet.content}
          </Typography>

          <Stack direction="row" marginTop={0.5} gap={2}>
            {tweet.replies && (
              <Box sx={{ width: 40 }}>
                <Button
                  onClick={() => {
                    setReplyToTweetId(tweet.id);
                    setModalOpen(true);
                  }}
                  sx={{
                    ...actionButtonStyle,
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption">
                    {tweet.replies.length ?? 0}
                  </Typography>
                </Button>
              </Box>
            )}

            <Box sx={{ width: 40 }}>
              <Button
                onClick={handleLike}
                sx={{
                  ...actionButtonStyle,
                  color: liked ? 'error.main' : 'text.disabled',
                  '&:hover': { color: 'error.main' }
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
            </Box>

            {isAuthor && (
              <Button
                onClick={handleDelete}
                sx={{
                  ...actionButtonStyle,
                  '&:hover': { color: 'text.secondary' }
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>

      <TweetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="REPLY"
        replyTo={replyToTweetId}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
