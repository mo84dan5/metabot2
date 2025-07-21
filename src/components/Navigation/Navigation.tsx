import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import TaskIcon from '@mui/icons-material/Task';
import SettingsIcon from '@mui/icons-material/Settings';
import { useStore } from '../../store/useStore';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setCurrentView } = useStore();

  const menuItems = [
    { id: 'chat', label: 'チャット', icon: <ChatIcon /> },
    { id: 'log', label: '会話ログ', icon: <HistoryIcon /> },
    { id: 'tasks', label: 'タスク', icon: <TaskIcon /> },
    { id: 'settings', label: '設定', icon: <SettingsIcon /> },
  ] as const;

  const handleMenuClick = (viewId: typeof menuItems[number]['id']) => {
    setCurrentView(viewId);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}>
            metabot2
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            メニュー
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => handleMenuClick(item.id)}>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
};

export default Navigation;