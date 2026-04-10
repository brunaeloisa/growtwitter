import { Box, Stack, styled } from '@mui/material';
import { TweetCard } from './TweetCard';
import type { Tweet } from '../types/tweet.types';

const ThreadLine = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 54,
  left: 31,
  width: 2,
  bottom: -6,
  backgroundColor: theme.palette.divider,
  zIndex: 10,
  borderRadius: 2
}));

export interface TweetThreadProps {
  tweet: Tweet;
  onDelete: () => void;
  triggerRefresh?: () => void;
  activeReplyId?: string;
}

export function TweetThread({
  tweet,
  onDelete,
  triggerRefresh,
  activeReplyId
}: TweetThreadProps) {
  const visibleReplies = activeReplyId
    ? tweet.replies?.filter((reply) => String(reply.id) === activeReplyId)
    : tweet.replies;

  const hasReplies = visibleReplies && visibleReplies.length > 0;

  return (
    <Stack>
      <Box position="relative">
        <TweetCard
          tweet={tweet}
          onDelete={onDelete}
          triggerRefresh={triggerRefresh}
        />
        {hasReplies && <ThreadLine />}
      </Box>

      {(visibleReplies || []).map((reply, index) => (
        <Box key={reply.id} position="relative">
          <TweetCard
            tweet={reply}
            onDelete={onDelete}
            triggerRefresh={triggerRefresh}
            replyTo={tweet.id}
            highlight={reply.id === activeReplyId}
          />
          {index < (visibleReplies?.length ?? 0) - 1 && <ThreadLine />}
        </Box>
      ))}
    </Stack>
  );
}
