import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useStore } from './store/useStore';
import { Navigation } from './components/Navigation';
import { Robot3D } from './components/Robot3D';
import { Chat } from './components/Chat';
import { ChatLog } from './components/ChatLog';
import { TaskBoard } from './components/TaskBoard';
import { Settings } from './components/Settings';
import { getApiKey } from './services/storage';
import { initializeOpenAI } from './services/openai';
import './App.css';

function App() {
  const { currentView } = useStore();

  useEffect(() => {
    // URLパラメータまたはLocalStorageからAPIキーを取得して初期化
    const apiKey = getApiKey();
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <Box sx={{ height: '100%', position: 'relative' }}>
            <Robot3D />
            <Chat />
          </Box>
        );
      case 'log':
        return <ChatLog />;
      case 'tasks':
        return <TaskBoard />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navigation />
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App
