import { Button, CircularProgress, type ButtonProps } from '@mui/material';

interface SubmitButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingLabel: string;
}

export function SubmitButton({
  isLoading,
  loadingLabel,
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <CircularProgress
            size="1em"
            color="inherit"
            sx={{ verticalAlign: 'middle', mr: 1 }}
          />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
