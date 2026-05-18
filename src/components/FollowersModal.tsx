import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { UserList } from './UserList';
import type { User } from '../types/user.types';
import CloseIcon from '@mui/icons-material/Close';
import type { TransitionProps } from '@mui/material/transitions';
import React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FollowersModalProps {
  open: boolean;
  onClose: () => void;
  title: 'Seguidores' | 'Seguindo';
  users: User[];
  followingList: string[];
  setFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
}

export function FollowersModal({
  open,
  onClose,
  title,
  users,
  followingList,
  setFollowingList
}: FollowersModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      scroll="paper"
      fullWidth
      maxWidth="sm"
      sx={{ '& .MuiDialog-container': { alignItems: { sm: 'flex-start' } } }}
      slots={{ transition: Transition }}
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(2px)' } },
        paper: { sx: { mt: { sm: 5.5 }, borderRadius: { sm: 3 } } }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          height: 49,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#0d0e11' : 'background.default'
        }}
      >
        <DialogTitle variant="body2" sx={{ fontWeight: 800, py: 0, px: 1 }}>
          {title}
        </DialogTitle>

        <IconButton color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />

      <DialogContent
        sx={{
          p: 0,
          minHeight: 200,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#0d0e11' : 'background.default'
        }}
      >
        {users.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2.5, textAlign: 'center' }}
          >
            Este usuário ainda não
            {title === 'Seguidores' ? ' possui seguidores.' : ' segue ninguém.'}
          </Typography>
        ) : (
          <UserList
            users={users}
            followingList={followingList}
            setFollowingList={setFollowingList}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
