import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Task } from '../../types';

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskDetailDialog = ({ task, open, onClose, onUpdate, onDelete }: TaskDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  if (!task) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({
      title: task.title,
      description: task.description || '',
      status: task.status,
      deadline: task.deadline,
    });
  };

  const handleSave = () => {
    if (editedTask.title?.trim()) {
      onUpdate(task.id, {
        ...editedTask,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({});
  };

  const handleDelete = () => {
    if (window.confirm('このタスクを削除してもよろしいですか？')) {
      onDelete(task.id);
      onClose();
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return '#ff6b6b';
      case 'doing': return '#4dabf7';
      case 'done': return '#51cf66';
      default: return '#868e96';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'やること';
      case 'doing': return '進行中';
      case 'done': return '完了';
      default: return status;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          タスクの詳細
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!isEditing ? (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                {task.title}
              </Typography>
              
              <Box sx={{ 
                display: 'inline-block',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: getStatusColor(task.status),
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}>
                {getStatusLabel(task.status)}
              </Box>
            </Box>

            {task.deadline && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Chip
                  label={`期限: ${new Date(task.deadline).toLocaleString('ja-JP')}`}
                  size="small"
                  color={new Date(task.deadline) < new Date() ? 'error' : 'default'}
                  variant={new Date(task.deadline) < new Date() ? 'filled' : 'outlined'}
                />
              </Box>
            )}

            {task.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  説明
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {task.description}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                作成日: {new Date(task.createdAt).toLocaleString('ja-JP')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                更新日: {new Date(task.updatedAt).toLocaleString('ja-JP')}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <TextField
              fullWidth
              label="タイトル"
              value={editedTask.title || ''}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={editedTask.status || 'todo'}
                label="ステータス"
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
              >
                <MenuItem value="todo">やること</MenuItem>
                <MenuItem value="doing">進行中</MenuItem>
                <MenuItem value="done">完了</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="期限"
              type="datetime-local"
              value={editedTask.deadline ? new Date(editedTask.deadline).toISOString().slice(0, -1) : ''}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value ? new Date(e.target.value) : undefined })}
              sx={{ mb: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="説明"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {!isEditing ? (
          <>
            <Button 
              onClick={handleDelete} 
              color="error"
              sx={{ mr: 'auto' }}
            >
              削除
            </Button>
            <Button 
              onClick={handleEdit}
              startIcon={<EditIcon />}
              variant="contained"
            >
              編集
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={handleCancel}
              startIcon={<CancelIcon />}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleSave}
              startIcon={<SaveIcon />}
              variant="contained"
            >
              保存
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailDialog;