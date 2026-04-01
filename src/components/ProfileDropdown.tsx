import React, { useState } from 'react';
import {
  Stack,
  Avatar,
  Box,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  MenuItem,
  ButtonBase,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/theme/theme.slice';
import { logout } from '../store/auth/auth.slice';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';

interface ProfileDropdownProps {
  name: string;
  username: string;
  imageUrl?: string | null;
}

export default function ProfileDropdown({
  name,
  username,
  imageUrl
}: ProfileDropdownProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  function handleThemeToggle() {
    dispatch(toggleTheme());
  }

  function handleLogout() {
    dispatch(logout());
    navigate('/login', { replace: true });
  }

  function handleToggle(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <ButtonBase
        onClick={handleToggle}
        sx={{
          textAlign: 'left',
          borderRadius: 10,
          p: 0,
          mb: 3,
          display: 'block',
          width: '100%'
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{
            borderRadius: 10,
            p: 1,
            '&:hover': { backgroundColor: 'background.paper' }
          }}
        >
          <Avatar
            src={imageUrl ?? undefined}
            sx={{
              width: 30,
              height: 30,
              '& img': {
                bgcolor: 'background.paper'
              }
            }}
          >
            <CropOriginalIcon fontSize="small" sx={{ color: '#ffffff' }} />
          </Avatar>

          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography
              fontSize={12}
              fontWeight={800}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {name}
            </Typography>

            <Typography
              fontSize={12}
              color="text.disabled"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              @{username}
            </Typography>
          </Box>

          <MoreHorizIcon sx={{ fontSize: 16 }} />
        </Stack>
      </ButtonBase>

      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="top"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'right top' : 'right bottom'
            }}
          >
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'background.paper'
                  }}
                >
                  <MenuItem
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => {
                      handleThemeToggle();
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <Brightness4Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Trocar tema</ListItemText>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sair</ListItemText>
                  </MenuItem>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
