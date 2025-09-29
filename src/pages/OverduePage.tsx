import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  Paper,
  Checkbox,
} from '@mui/material';
import {
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  PriorityHigh,
  Warning,
  Assignment,
  MoreVert,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { TaskForm } from '../components/Tasks/TaskForm';
import { TaskPreview } from '../components/Tasks/TaskPreview';
import { Task } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const priorityColors = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#2196f3',
} as const;

const priorityIcons = {
  Alta: '🔴',
  Média: '🟡',
  Baixa: '🔵',
} as const;

export const OverduePage = () => {
  const { user } = useAuth();
  const { tasks, loading, deleteTask, updateTask } = useTasks(user?.id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filtrar tarefas vencidas
  const overdueTasks = tasks.filter(task => {
    const today = dayjs();
    const dueDate = dayjs(task.due_date);
    return dueDate.isBefore(today, 'day') && task.status !== 'completed';
  });

  const urgentOverdueTasks = overdueTasks.filter(
    task => task.priority === 'Alta'
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, { status: 'completed' });
  };

  const handleViewTask = (task: Task) => {
    setPreviewTask(task);
  };

  const handleEditFromPreview = (task: Task) => {
    setPreviewTask(null);
    setEditingTask(task);
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

  const formatTaskTime = (task: Task) => {
    const taskDate = dayjs(task.due_date);
    const today = dayjs();
    const daysDiff = today.diff(taskDate, 'day');

    if (daysDiff === 1) {
      return 'Ontem';
    } else if (daysDiff === 0) {
      return 'Hoje';
    } else {
      return `Há ${daysDiff} dias`;
    }
  };

  const getOverdueSeverity = (task: Task) => {
    const taskDate = dayjs(task.due_date);
    const today = dayjs();
    const daysDiff = today.diff(taskDate, 'day');

    if (daysDiff >= 7) return 'error';
    if (daysDiff >= 3) return 'warning';
    return 'info';
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
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
            }}
          >
            <Warning sx={{ fontSize: '2rem', color: 'white' }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 0.5,
              }}
            >
              Tarefas Vencidas
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {overdueTasks.length === 1
                ? '1 tarefa precisa de atenção'
                : `${overdueTasks.length} tarefas precisam de atenção`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Lista de Tarefas Vencidas */}
      {overdueTasks.length === 0 ? (
        <Alert
          severity="success"
          sx={{
            backgroundColor: '#1e1e1e',
            color: '#b0b0b0',
            borderRadius: 2,
          }}
        >
          🎉 Parabéns! Não há tarefas vencidas. Você está em dia!
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {overdueTasks.map(task => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                sx={{
                  backgroundColor: '#2a2a2a',
                  border: '2px solid',
                  borderColor: priorityColors[task.priority],
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#333',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${priorityColors[task.priority]}40`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${
                      priorityColors[task.priority]
                    } 0%, ${priorityColors[task.priority]}CC 100%)`,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Checkbox
                          checked={task.status === 'completed'}
                          onChange={() => handleCompleteTask(task)}
                          icon={<CheckBoxOutlineBlank />}
                          checkedIcon={<CheckBox />}
                          sx={{
                            color: '#4caf50',
                            '&.Mui-checked': {
                              color: '#4caf50',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            },
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            flex: 1,
                          }}
                        >
                          {task.title}
                        </Typography>
                      </Box>

                      {task.description && (
                        <Box
                          sx={{
                            mb: 2,
                            color: '#b0b0b0',
                            flex: 1,
                            maxHeight: '60px',
                            overflow: 'hidden',
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                              color: '#b0b0b0',
                              margin: '2px 0',
                              fontSize: '0.875rem',
                            },
                            '& p': {
                              color: '#b0b0b0',
                              margin: '1px 0',
                              fontSize: '0.875rem',
                            },
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              task.description.length > 100
                                ? `${task.description.substring(0, 100)}...`
                                : task.description,
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            backgroundColor: priorityColors[task.priority],
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />

                        <Chip
                          label={formatTaskTime(task)}
                          size="small"
                          color={getOverdueSeverity(task)}
                          variant="outlined"
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
                      </Box>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLElement>) =>
                        handleMenuOpen(e, task)
                      }
                      sx={{ color: '#b0b0b0' }}
                    >
                      <MoreVert />
                    </IconButton>
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
        <MenuItem onClick={() => handleViewTask(selectedTask!)}>
          <ListItemIcon>
            <Assignment fontSize="small" />
          </ListItemIcon>
          <ListItemText>Visualizar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditTask}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteTask} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Edição de Tarefa */}
      <TaskForm
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        userId={user?.id || ''}
        taskId={editingTask?.id}
        onTaskUpdated={() => {
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
            : undefined
        }
      />

      {/* Task Preview */}
      {previewTask && (
        <TaskPreview
          open={Boolean(previewTask)}
          task={previewTask}
          onClose={() => setPreviewTask(null)}
          onEdit={() => handleEditFromPreview(previewTask)}
        />
      )}
    </Box>
  );
};
