import { NavLink } from 'react-router-dom';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface NavMenuItemProps {
  icon: SvgIconComponent;
  iconActive: SvgIconComponent;
  children: React.ReactNode;
  to: string;
  end?: boolean;
}

export function NavMenuItem({
  to,
  icon: Icon,
  iconActive: IconActive,
  children,
  end
}: NavMenuItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {({ isActive }) => (
        <MenuItem
          selected={isActive}
          sx={{
            color: 'text.primary',
            borderRadius: 8,
            py: 1,
            px: 0,

            '&.Mui-selected': {
              backgroundColor: 'background.default'
            },

            '&:hover': {
              backgroundColor: 'background.paper'
            },

            '&.Mui-selected:hover': {
              backgroundColor: 'background.paper'
            }
          }}
        >
          <ListItemIcon
            sx={{
              color: 'text.primary',
              justifyContent: 'center'
            }}
          >
            {isActive ? (
              <IconActive
                sx={{
                  fontSize: IconActive === Icon ? 19 : 18,
                  transform: IconActive === Icon ? 'scale(1.05)' : 'scale(1)'
                }}
              />
            ) : (
              <Icon sx={{ fontSize: 18 }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={children}
            slotProps={{
              primary: {
                fontSize: '0.875rem',
                fontWeight: isActive ? 800 : 400
              }
            }}
          />
        </MenuItem>
      )}
    </NavLink>
  );
}
