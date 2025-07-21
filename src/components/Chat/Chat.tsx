import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useStore } from '../../store/useStore';
import { getChatCompletion, textToSpeech, speechToText, initializeOpenAI } from '../../services/openai';
import { getApiKey, isTestMode } from '../../services/storage';

const Chat = () => {
  const { messages, addMessage } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = getApiKey();
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatCompletion(
        messages.concat(userMessage).map(m => ({
          role: m.role,
          content: m.content,
        }))
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant' as const,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);

      // 音声出力
      try {
        const audioBuffer = await textToSpeech(response);
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        source.buffer = await audioContext.decodeAudioData(audioBuffer);
        source.connect(audioContext.destination);
        source.start(0);
      } catch (error) {
        console.error('音声出力エラー:', error);
      }
    } catch (error) {
      console.error('チャットエラー:', error);
      addMessage({
        id: (Date.now() + 1).toString(),
        content: 'エラーが発生しました。APIキーを確認してください。',
        role: 'assistant',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        try {
          const text = await speechToText(blob);
          setInput(text);
        } catch (error) {
          console.error('音声認識エラー:', error);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('録音開始エラー:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // 最後のアシスタントメッセージを取得
  const lastAssistantMessage = messages
    .filter(m => m.role === 'assistant')
    .slice(-1)[0];

  return (
    <Box sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {isTestMode() && (
        <Alert severity="warning" sx={{ borderRadius: 0 }}>
          テストモードで実行中です（モックレスポンスを使用）
        </Alert>
      )}
      
      {/* 最後のメッセージをオーバーレイ表示 */}
      {(lastAssistantMessage || isLoading) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100px', // 入力欄の高さ分上に配置
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            animation: 'fadeIn 0.3s ease-in-out',
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'translateX(-50%) translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateX(-50%) translateY(0)',
              },
            },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 3,
              minWidth: '300px',
              maxWidth: '600px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'text.primary'
                }}
              >
                {lastAssistantMessage?.content}
              </Typography>
            )}
          </Paper>
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            color={isRecording ? 'error' : 'primary'}
            sx={{
              backgroundColor: isRecording ? 'error.lighter' : 'action.hover',
              '&:hover': {
                backgroundColor: isRecording ? 'error.light' : 'action.selected',
              },
            }}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
          
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="メッセージを入力..."
            disabled={isLoading || isRecording}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          
          <IconButton
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isRecording}
            color="primary"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;