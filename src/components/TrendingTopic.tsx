import { Box, Typography } from '@mui/material';

interface TopicProps {
  category: string;
  title: string;
  tweetsCount?: number;
}

type Props = TopicProps & {
  variant?: 'sidebar';
};

export function TrendingTopic({ variant, ...topic }: Props) {
  return (
    <Box
      component="li"
      sx={{
        px: 1.5,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        '&:hover': {
          backgroundColor:
            variant === 'sidebar' ? 'action.hover' : 'background.paper'
        }
      }}
    >
      <Typography fontSize={10} lineHeight={1} color="text.disabled">
        {topic.category}
      </Typography>

      <Typography variant="caption" lineHeight={1} fontWeight={800}>
        {topic.title}
      </Typography>

      <Typography fontSize={10} lineHeight={1} color="text.disabled">
        {(topic.tweetsCount ?? 1111).toLocaleString('pt-BR')} growtweets
      </Typography>
    </Box>
  );
}
