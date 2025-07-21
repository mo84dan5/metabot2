import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../../store/useStore';

const ChatLog = () => {
  const { messages, clearMessages, setCurrentView } = useStore();

  return (
    <Container maxWidth="md" sx={{ py: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          会話ログ
        </Typography>
        <IconButton
          onClick={() => setCurrentView('chat')}
          aria-label="閉じる"
          sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {messages.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Alert severity="info">
            会話履歴がありません
          </Alert>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearMessages}
              startIcon={<DeleteIcon />}
            >
              履歴をクリア
            </Button>
          </Box>

          <Paper sx={{ flex: 1, overflow: 'auto' }}>
            <List>
              {messages.map((message, index) => (
                <Box key={message.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: message.role === 'user' ? 'primary.main' : 'success.main',
                              fontWeight: 600,
                            }}
                          >
                            {message.role === 'user' ? 'あなた' : 'アシスタント'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(message.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default ChatLog;