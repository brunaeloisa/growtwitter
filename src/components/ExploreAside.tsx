import { Box, Link, Typography } from '@mui/material';
import { SearchInput } from './SearchInput';
import { TrendingTopic } from './TrendingTopic';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { topics } from '../data/trendingTopics';
import { Link as RouterLink } from 'react-router-dom';

export default function ExploreAside() {
  const sidebarTopics = topics.slice(0, 5);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <SearchInput
        value={search}
        onValueChange={setSearch}
        onSearch={(value) => {
          navigate('/explore?tab=search', { state: { query: value } });
        }}
      />

      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Typography
          variant="body2"
          component="h2"
          sx={{ py: 1, px: 1.5, fontWeight: 800 }}
        >
          O que está acontecendo?
        </Typography>

        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {sidebarTopics.map((topic) => (
            <TrendingTopic
              key={topic.id}
              title={topic.title}
              category={topic.category}
              variant="sidebar"
            />
          ))}
        </Box>

        <Link
          component={RouterLink}
          to="/explore"
          underline="none"
          sx={{
            py: 1,
            px: 1.5,
            display: 'block',
            fontSize: 10,
            '&:hover': {
              color: 'primary.dark',
              backgroundColor: 'action.hover'
            }
          }}
        >
          Mostrar mais
        </Link>
      </Box>
    </>
  );
}
