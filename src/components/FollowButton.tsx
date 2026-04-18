import { Button } from '@mui/material';
import { useState } from 'react';
import { followUser, unfollowUser } from '../services/user.service';

interface FollowButtonProps {
  userId: string;
  username: string;
  followingList: string[];
  setFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
}

export function FollowButton({
  userId,
  username,
  followingList,
  setFollowingList
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const isFollowing = followingList.includes(userId);

  async function handleFollow() {
    if (!userId || loading) return;

    setLoading(true);

    const wasFollowing = isFollowing;

    setFollowingList((prevList) =>
      wasFollowing
        ? prevList.filter((id) => id !== userId)
        : [...prevList, userId]
    );

    const success = wasFollowing
      ? await unfollowUser(userId)
      : await followUser(userId);

    if (!success)
      setFollowingList((prevList) =>
        wasFollowing
          ? [...prevList, userId]
          : prevList.filter((id) => id !== userId)
      );

    setLoading(false);
  }

  return (
    <Button
      onClick={handleFollow}
      aria-label={
        isFollowing ? `Deixar de seguir @${username}` : `Seguir  @${username}`
      }
      variant={isFollowing ? 'outlined' : 'contained'}
      sx={{
        height: 32,
        borderRadius: 5,
        fontWeight: 600,
        flexShrink: 0,
        transition: 'border-color 0.2s ease, color 0.2s ease',
        ...(isFollowing
          ? {
              borderColor: 'text.primary',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'error.main',
                color: 'error.main'
              }
            }
          : {
              backgroundColor: 'text.primary',
              color: 'background.default',
              '&:hover': {
                backgroundColor: 'text.secondary'
              }
            })
      }}
    >
      {isFollowing ? 'Seguindo' : 'Seguir'}
    </Button>
  );
}
