import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { postReply, postTweet } from '../services/tweet.service';
import { CustomSnackbar } from './CustomSnackbar';

interface TweetModalProps {
  open: boolean;
  onClose: () => void;
  onTweetCreated: () => void;
  mode: 'NORMAL' | 'REPLY';
  replyTo?: string;
}

export default function TweetModalButton({
  open,
  onClose,
  onTweetCreated,
  mode,
  replyTo
}: TweetModalProps) {
  const [tweetContent, setTweetContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  async function handleTweet() {
    if (!tweetContent.trim()) return;

    setLoading(true);

    const success =
      mode === 'REPLY' && replyTo
        ? await postReply(tweetContent, replyTo)
        : await postTweet(tweetContent);

    setLoading(false);

    if (success) {
      setSnackbar({
        open: true,
        message: mode === 'REPLY' ? 'Resposta enviada!' : 'Tweet enviado!',
        severity: 'success'
      });
      setTweetContent('');
      onTweetCreated();
    } else {
      setSnackbar({
        open: true,
        message:
          mode === 'REPLY' ? 'Erro ao enviar resposta' : 'Erro ao enviar tweet',
        severity: 'error'
      });
    }
  }

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          aria-label={mode === 'REPLY' ? 'Responder Tweet' : 'Tweetar'}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              maxWidth: '90%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              py: 2,
              px: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <TextField
              multiline
              rows={4}
              placeholder="O que está acontecendo?"
              variant="standard"
              fullWidth
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleTweet}
                disabled={!tweetContent.trim() || loading}
              >
                {loading ? 'Tweetando...' : 'Tweetar'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
}
