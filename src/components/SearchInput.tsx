import { IconButton, InputAdornment, styled, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',

    '& fieldset': {
      borderColor: theme.palette.divider
    },

    '&:hover fieldset': {
      borderColor: theme.palette.text.disabled
    },

    '&.Mui-focused fieldset': {
      borderColor: theme.palette.text.secondary
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '1px'
    },

    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: theme.palette.text.disabled
    },

    '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: theme.palette.text.primary
    }
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.text.primary
  },

  '& .MuiInputBase-input': {
    padding: '0.75rem 1.25rem 0.75rem 0',
    fontSize: '0.8125rem'
  },

  '& .MuiOutlinedInput-root.MuiInputBase-adornedEnd .MuiOutlinedInput-input': {
    paddingLeft: '1rem',
    paddingRight: '0'
  }
}));

export function SearchInput({
  value,
  onValueChange,
  onSearch
}: SearchInputProps) {
  const iconPosition = onSearch ? 'end' : 'start';

  const searchIcon = (
    <InputAdornment position={iconPosition}>
      {onSearch ? (
        <IconButton edge={iconPosition} onClick={() => onSearch(value)}>
          <SearchRoundedIcon />
        </IconButton>
      ) : (
        <SearchRoundedIcon />
      )}
    </InputAdornment>
  );

  return (
    <SearchField
      fullWidth
      id="searchInput"
      placeholder="Buscar usuário..."
      slotProps={{ input: { [iconPosition + 'Adornment']: searchIcon } }}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSearch?.(value);
        }
      }}
    />
  );
}
