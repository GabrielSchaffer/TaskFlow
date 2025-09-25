import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Grid,
} from '@mui/material';
import {
  Edit,
  Delete,
  PlayArrow,
  Add,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { TaskForm } from '../components/Tasks/TaskForm';
import { Task } from '../types';
import dayjs from 'dayjs';

const priorityColors = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#2196f3',
} as const;

export const MyDayPage = () => {
  const { user } = useAuth();
  const { tasks, loading, deleteTask, updateTask, moveTaskToNextDay } =
    useTasks(user?.id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Filtrar tarefas do dia atual
  const todayTasks = tasks.filter(task => {
    const taskDate = dayjs(task.due_date);
    const today = dayjs();
    return taskDate.isSame(today, 'day');
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      handleMenuClose();
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id);
      handleMenuClose();
    }
  };

  const handleMoveToNextDay = async () => {
    if (selectedTask) {
      await moveTaskToNextDay(selectedTask.id);
      handleMenuClose();
    }
  };

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, { status: 'completed' });
  };

  const formatTaskTime = (task: Task) => {
    const taskDate = dayjs(task.due_date);
    return taskDate.format('HH:mm');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ backgroundColor: '#121212' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
          Meu Dia
        </Typography>
        <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 2 }}>
          Suas tarefas para hoje - {dayjs().format('DD/MM/YYYY')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowTaskForm(true)}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Nova Tarefa
        </Button>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ p: 2, backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              {todayTasks.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Total de Tarefas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ p: 2, backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          >
            <Typography variant="h6" sx={{ color: '#4caf50' }}>
              {todayTasks.filter(task => task.status === 'completed').length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Concluídas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ p: 2, backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          >
            <Typography variant="h6" sx={{ color: '#ff9800' }}>
              {todayTasks.filter(task => task.status === 'in_progress').length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Em Andamento
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Tarefas */}
      {todayTasks.length === 0 ? (
        <Alert
          severity="info"
          sx={{ backgroundColor: '#1e1e1e', color: '#b0b0b0' }}
        >
          Nenhuma tarefa para hoje. Que tal criar uma nova?
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {todayTasks.map(task => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                sx={{
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #333',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', flex: 1 }}>
                      {task.title}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLElement>) =>
                        handleMenuOpen(e, task)
                      }
                      sx={{ color: '#b0b0b0' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>

                  {task.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: '#b0b0b0', mb: 2 }}
                    >
                      {task.description.length > 100
                        ? `${task.description.substring(0, 100)}...`
                        : task.description}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Schedule fontSize="small" sx={{ color: '#b0b0b0' }} />
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {formatTaskTime(task)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}
                  >
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        backgroundColor: priorityColors[task.priority],
                        color: 'white',
                      }}
                    />

                    {task.category && (
                      <Chip
                        label={task.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: '#b0b0b0',
                          borderColor: '#555',
                        }}
                      />
                    )}

                    {task.important && (
                      <Chip
                        label="Importante"
                        size="small"
                        sx={{
                          backgroundColor: '#ff9800',
                          color: 'white',
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleCompleteTask(task)}
                      disabled={task.status === 'completed'}
                      sx={{
                        color:
                          task.status === 'completed' ? '#4caf50' : '#1976d2',
                        borderColor:
                          task.status === 'completed' ? '#4caf50' : '#1976d2',
                        '&:hover': {
                          borderColor:
                            task.status === 'completed' ? '#4caf50' : '#1565c0',
                        },
                      }}
                    >
                      {task.status === 'completed' ? 'Concluída' : 'Concluir'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu de Ações da Tarefa */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditTask}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMoveToNextDay}>
          <ListItemIcon>
            <PlayArrow fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mover para Em Andamentoe</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteTask} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Nova/Edição de Tarefa */}
      <TaskForm
        open={showTaskForm || Boolean(editingTask)}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        userId={user?.id || ''}
        taskId={editingTask?.id}
        onTaskUpdated={() => {
          // Forçar atualização da página
          window.location.reload();
        }}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description || '',
                due_date: editingTask.due_date,
                priority: editingTask.priority,
                category: editingTask.category,
                important: editingTask.important,
                status: editingTask.status,
              }
            : {
                title: '',
                description: '',
                due_date: dayjs().toISOString(),
                priority: 'Média',
                category: '',
                important: false,
                status: 'todo',
              }
        }
      />
    </Box>
  );
};
