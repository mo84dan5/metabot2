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
  Grid,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../../store/useStore';
import type { Task } from '../../types';

const TaskBoard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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
    return tasks.filter(task => task.status === status);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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

      <Grid container spacing={2}>
        {columns.map((column) => (
          <Grid item xs={12} md={4} key={column.id}>
            <Paper
              sx={{
                height: '100%',
                minHeight: 400,
                backgroundColor: 'grey.50',
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
              
              <Box sx={{ p: 2 }}>
                {getTasksByStatus(column.id as Task['status']).map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    sx={{
                      mb: 2,
                      cursor: 'move',
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
                      <IconButton
                        size="small"
                        onClick={() => deleteTask(task.id)}
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TaskBoard;