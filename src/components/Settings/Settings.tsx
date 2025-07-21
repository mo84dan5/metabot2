import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import { useStore } from '../../store/useStore';
import { initializeOpenAI } from '../../services/openai';

const Settings = () => {
  const { apiSettings, updateApiSettings } = useStore();
  const [apiKey, setApiKey] = useState(apiSettings.openaiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateApiSettings({ openaiApiKey: apiKey });
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        設定
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          OpenAI APIキー
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          OpenAI APIキーを入力してください。APIキーは
          <Link href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" sx={{ mx: 0.5 }}>
            OpenAIダッシュボード
          </Link>
          から取得できます。
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowKey(!showKey)}
                    edge="end"
                  >
                    {showKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          sx={{ mb: 2 }}
        >
          保存
        </Button>
        
        {saved && (
          <Alert severity="success" sx={{ mt: 2 }}>
            保存しました！
          </Alert>
        )}
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          URLパラメータでの設定
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          APIキーはURLパラメータでも設定できます：
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            backgroundColor: 'grey.100',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflowX: 'auto',
          }}
        >
          {window.location.origin}{window.location.pathname}?OPENAI_API_KEY=YOUR_API_KEY
        </Paper>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          注意事項
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="APIキーは安全に保管してください"
              secondary="第三者に公開しないよう注意してください"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="ローカルストレージに保存"
              secondary="このアプリはブラウザのローカルストレージにAPIキーを保存します"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="共有デバイスでの使用"
              secondary="共有デバイスでは使用後にAPIキーをクリアすることをお勧めします"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Settings;