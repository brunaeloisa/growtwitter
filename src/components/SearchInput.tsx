import { InputAdornment, styled, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
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
  }
}));

export function SearchInput({ value, onValueChange }: SearchInputProps) {
  return (
    <SearchField
      fullWidth
      id="searchInput"
      placeholder="Buscar usuário..."
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          )
        }
      }}
    />
  );
}
