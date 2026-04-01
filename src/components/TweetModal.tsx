import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
interface TweetModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TweetModalButton({ open, onClose }: TweetModalProps) {
  const [tweetContent, setTweetContent] = useState('');

  const handleTweet = () => {
    if (!tweetContent.trim()) return;

    console.log('Tweet enviado:', tweetContent);
    setTweetContent('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="tweet-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          maxWidth: '90%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}
        >
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, px: 1.5 }}>
          <TextField
            multiline
            rows={4}
            placeholder="O que está acontecendo?"
            variant="standard"
            fullWidth
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleTweet}
            disabled={!tweetContent.trim()}
          >
            Tweetar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
