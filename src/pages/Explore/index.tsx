import { Box, Typography } from '@mui/material';
import { TrendingTopic } from '../../components/TrendingTopic';
import { topics } from '../../data/trendingTopics';
import { NavbarTop } from '../../components/NavbarTop';

export function Explore() {
  return (
    <>
      <NavbarTop positionMd="static">
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Typography component="h1" variant="body2" sx={{ fontWeight: 800 }}>
            Explorar
          </Typography>
        </Box>
      </NavbarTop>

      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
        {topics.map((topic) => (
          <TrendingTopic
            key={topic.id}
            title={topic.title}
            category={topic.category}
          ></TrendingTopic>
        ))}
      </Box>
    </>
  );
}
