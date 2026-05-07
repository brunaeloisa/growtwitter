import { Avatar, Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import type { User } from '../types/user.types';
import { FollowButton } from './FollowButton';

interface UserListProps {
  users: User[];
  followingList: string[];
  setFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
}

export function UserList({
  users,
  followingList,
  setFollowingList
}: UserListProps) {
  return (
    <>
      {users.map((user) => (
        <Stack
          key={user.id}
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            '&:hover': { bgcolor: 'background.paper' }
          }}
        >
          <Link
            component={RouterLink}
            to={`/profile/${user.id}`}
            underline="none"
            color="inherit"
            sx={{ display: 'flex', gap: 1, minWidth: 0, flexGrow: 1 }}
          >
            <Avatar
              src={user.imageUrl ?? undefined}
              sx={{
                width: 40,
                height: 40,
                '& img': { bgcolor: 'background.paper' },
                '&:hover': {
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }
              }}
            >
              <CropOriginalIcon sx={{ color: 'common.white' }} />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={800}
                noWrap
                sx={{
                  display: 'block',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {user.name}
              </Typography>

              <Typography
                variant="caption"
                fontWeight={500}
                color="text.disabled"
                noWrap
                sx={{
                  display: 'block',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                @{user.username}
              </Typography>
            </Box>
          </Link>

          <FollowButton
            userId={user.id}
            username={user.username}
            followingList={followingList}
            setFollowingList={setFollowingList}
          />
        </Stack>
      ))}
    </>
  );
}
