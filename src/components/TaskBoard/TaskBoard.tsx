import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useStore } from '../../store/useStore';
import type { Task } from '../../types';
import TaskDetailDialog from './TaskDetailDialog';

const TaskBoard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = [
    { id: 'todo', title: 'やること', color: '#ff6b6b' },
    { id: 'doing', title: '進行中', color: '#4dabf7' },
    { id: 'done', title: '完了', color: '#51cf66' },
  ] as const;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTask(newTask);
    setNewTaskTitle('');
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTask) {
      updateTask(draggedTask.id, { status });
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => {
        // 期限がないタスクは最後に配置
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        
        // 期限が早い順にソート
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 3,
        height: '100vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        タスク管理
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="新しいタスクを追加..."
          variant="outlined"
          size="medium"
        />
        <Button
          variant="contained"
          onClick={handleAddTask}
          startIcon={<AddIcon />}
          sx={{ px: 3 }}
        >
          追加
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexDirection: { xs: 'column', md: 'row' },
        pb: { xs: 10, md: 3 }, // スマホで下部に余白を追加
      }}>
        {columns.map((column) => (
          <Box key={column.id} sx={{ 
            flex: { xs: '0 0 auto', md: '1 1 30%' },
            minWidth: { xs: '100%', md: 0 },
          }}>
            <Paper
              sx={{
                height: { xs: 'auto', md: '100%' },
                minHeight: { xs: 300, md: 400 },
                maxHeight: { xs: 400, md: 'none' },
                backgroundColor: 'grey.50',
                overflow: { xs: 'hidden', md: 'visible' },
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Task['status'])}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: column.color,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {column.title}
                </Typography>
                <Chip
                  label={getTasksByStatus(column.id as Task['status']).length}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                  }}
                />
              </Box>
              
              <Box sx={{ 
                p: 2,
                maxHeight: { xs: 300, md: 'calc(100% - 64px)' },
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}>
                {getTasksByStatus(column.id as Task['status']).map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onClick={() => handleTaskClick(task)}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <CardContent sx={{ position: 'relative', pb: '16px !important' }}>
                      <Typography variant="body1" sx={{ pr: 4 }}>
                        {task.title}
                      </Typography>
                      {task.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {task.description}
                        </Typography>
                      )}
                      {task.deadline && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                          <AccessTimeIcon 
                            fontSize="small" 
                            color={new Date(task.deadline) < new Date() ? 'error' : 'action'}
                          />
                          <Typography 
                            variant="caption" 
                            color={new Date(task.deadline) < new Date() ? 'error' : 'text.secondary'}
                          >
                            {new Date(task.deadline).toLocaleString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          '&:hover': {
                            backgroundColor: 'error.lighter',
                            color: 'error.main',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>

      <TaskDetailDialog
        task={selectedTask}
        open={dialogOpen}
        onClose={handleDialogClose}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </Container>
  );
};

export default TaskBoard;