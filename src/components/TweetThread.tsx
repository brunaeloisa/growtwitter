import { Box, Stack, styled } from '@mui/material';
import { TweetCard } from './TweetCard';
import type { Tweet } from '../types/tweet.types';

const ThreadLine = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 52,
  left: 27.5,
  width: 2,
  bottom: -4,
  backgroundColor: theme.palette.divider,
  zIndex: 10,
  borderRadius: 2
}));

export function TweetThread({ tweet }: { tweet: Tweet }) {
  return (
    <Stack>
      <Box position="relative">
        <TweetCard tweet={tweet} />
        {tweet.replies && tweet.replies.length > 0 && <ThreadLine />}
      </Box>

      {(tweet.replies || []).map((reply, index) => (
        <Box key={reply.id} position="relative">
          <TweetCard tweet={reply} />
          {index < (tweet.replies?.length ?? 0) - 1 && <ThreadLine />}
        </Box>
      ))}
    </Stack>
  );
}
