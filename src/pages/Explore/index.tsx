import { Box, Typography } from '@mui/material';
import { TrendingTopic } from '../../components/TrendingTopic';
import { topics } from '../../data/trendingTopics';
import { NavbarTop } from '../../components/NavbarTop';

export function Explore() {
  return (
    <>
      <NavbarTop positionMd="static">
        <Typography
          component="h1"
          variant="body2"
          sx={{
            p: 1.5,
            py: { xs: 2, md: 1.5 },
            fontWeight: 800,
            borderBottom: 1,
            borderColor: 'divider',
            marginBottom: 1
          }}
        >
          Explorar
        </Typography>
      </NavbarTop>

      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0
        }}
      >
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
