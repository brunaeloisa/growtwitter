import { Avatar, Box, Button, Stack, Typography, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Tweet } from '../types/tweet.types';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteTweet, likeTweet, unlikeTweet } from '../services/tweet.service';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TweetModal from './TweetModal';
import { useAppSelector } from '../store/hooks';
import { CustomSnackbar } from './CustomSnackbar';
import { formatFullDateTime, formatRelativeTime } from '../utils/dateFormat';

export interface TweetCardProps {
  tweet: Tweet;
  onDelete: () => void;
  triggerRefresh?: () => void;
  replyTo?: string;
  highlight?: boolean;
  parentAuthor?: { id: string; username: string };
}

export function TweetCard({
  tweet,
  onDelete,
  triggerRefresh,
  replyTo,
  highlight = false,
  parentAuthor
}: TweetCardProps) {
  const [liked, setLiked] = useState(tweet.likedByUser);
  const [likeCount, setLikeCount] = useState(tweet.likeCount);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyDelta, setReplyDelta] = useState(0);
  const [replyToTweetId, setReplyToTweetId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const loggedUser = useAppSelector((state) => state.auth.user);
  const isAuthor = tweet.author.id === loggedUser?.id;
  const replyCount = (tweet.replies?.length ?? 0) + replyDelta;
  const navigate = useNavigate();

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    minWidth: 'auto',
    gap: 0.5,
    p: 0,
    color: 'text.disabled',
    bgcolor: 'transparent'
  };

  const authorLink = (
    <Link
      component={RouterLink}
      to={`/profile/${tweet.author.id}`}
      underline="none"
      color="inherit"
      onClick={(e) => e.stopPropagation()}
      sx={{
        display: 'flex',
        flexDirection: highlight ? 'column' : 'row',
        gap: highlight ? 0 : 0.5
      }}
    >
      <Typography
        variant={highlight ? 'body2' : 'caption'}
        fontWeight={800}
        sx={{ '&:hover': { textDecoration: 'underline' } }}
      >
        {tweet.author.name}
      </Typography>

      <Typography
        variant="caption"
        fontWeight={500}
        color="text.disabled"
        sx={{ '&:hover': { textDecoration: 'underline' } }}
      >
        @{tweet.author.username}
      </Typography>
    </Link>
  );

  async function handleLike() {
    if (loading) return;

    setLoading(true);

    const prevCount = likeCount;

    setLiked(!liked);
    setLikeCount((prev: number) => (liked ? prev - 1 : prev + 1));

    const success = liked
      ? await unlikeTweet(tweet.id)
      : await likeTweet(tweet.id);

    if (!success) {
      setLiked(!liked);
      setLikeCount(prevCount);
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

  const handleTweetCreated = () => {
    if (triggerRefresh) {
      triggerRefresh();
    } else {
      setReplyDelta((prev) => prev + 1);
    }

    setModalOpen(false);
  };

  function handleTweetClick(event: React.MouseEvent<HTMLDivElement>): void {
    const target = event.currentTarget as HTMLElement;
    const parentId = target.getAttribute('data-reply-to');

    if (parentId) {
      navigate(`/tweet/${parentId}?reply=${tweet.id}`);
    } else {
      navigate(`/tweet/${tweet.id}`);
    }
  }

  return (
    <>
      <Stack
        direction={highlight ? 'column' : 'row'}
        sx={{
          gap: 1,
          px: 1.5,
          py: 1.25,
          '&:hover': {
            cursor: 'pointer',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.25)
          }
        }}
        onClick={handleTweetClick}
        data-reply-to={replyTo}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Link
            component={RouterLink}
            to={`/profile/${tweet.author.id}`}
            underline="none"
            color="inherit"
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: 'flex',
              borderRadius: '50%',
              alignSelf: 'flex-start',
              '&:hover .MuiAvatar-root': {
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }
            }}
          >
            <Avatar
              src={tweet.author.imageUrl ?? undefined}
              sx={{
                width: 40,
                height: 40,
                '& img': { bgcolor: 'background.paper' }
              }}
            >
              <CropOriginalIcon sx={{ color: 'common.white' }} />
            </Avatar>
          </Link>

          {highlight && authorLink}
        </Stack>

        <Box sx={{ p: highlight ? 0.25 : 0 }}>
          {!highlight && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {authorLink}

              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ display: highlight ? 'none' : 'inline-block' }}
              >
                • {formatRelativeTime(tweet.createdAt)}
              </Typography>
            </Box>
          )}

          {parentAuthor && !highlight && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: 'block', lineHeight: 1.3, mb: 0.5 }}
            >
              Em resposta a{' '}
              <Link
                component={RouterLink}
                to={`/profile/${parentAuthor.id}`}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                @{parentAuthor.username}
              </Link>
            </Typography>
          )}

          <Typography
            variant={highlight ? 'body1' : 'caption'}
            color="text.secondary"
            component="div"
            sx={{ my: highlight ? 0.75 : 0 }}
          >
            {tweet.content}
          </Typography>

          {highlight && (
            <Typography
              variant={'caption'}
              color="text.disabled"
              component="div"
              sx={{ my: 1.5 }}
            >
              {formatFullDateTime(tweet.createdAt)}
            </Typography>
          )}

          <Stack
            direction="row"
            sx={{ width: 'fit-content', gap: 2, mt: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
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
                  <Typography variant="caption">{replyCount}</Typography>
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
                  {likeCount}
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
        onTweetCreated={handleTweetCreated}
        mode="REPLY"
        replyTo={replyToTweetId}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity="error"
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
}
