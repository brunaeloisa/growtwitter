import { Box, Stack, styled } from '@mui/material';
import { TweetCard, type TweetCardProps } from './TweetCard';

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

export function TweetThread({
  tweet,
  onDelete,
  triggerRefresh
}: TweetCardProps) {
  return (
    <Stack>
      <Box position="relative">
        <TweetCard
          tweet={tweet}
          onDelete={onDelete}
          triggerRefresh={triggerRefresh}
        />
        {tweet.replies && tweet.replies.length > 0 && <ThreadLine />}
      </Box>

      {(tweet.replies || []).map((reply, index) => (
        <Box key={reply.id} position="relative">
          <TweetCard
            tweet={reply}
            onDelete={onDelete}
            triggerRefresh={triggerRefresh}
          />
          {index < (tweet.replies?.length ?? 0) - 1 && <ThreadLine />}
        </Box>
      ))}
    </Stack>
  );
}
