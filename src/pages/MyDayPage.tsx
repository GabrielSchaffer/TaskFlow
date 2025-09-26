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
  Assignment,
  DoneAll,
  PlayCircleOutline,
  PendingActions,
  MoreVert,
  Visibility,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { TaskForm } from '../components/Tasks/TaskForm';
import { TaskPreview } from '../components/Tasks/TaskPreview';
import { Task } from '../types';
import dayjs from 'dayjs';

const priorityColors = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#2196f3',
} as const;

const statusConfig = {
  todo: {
    title: 'Pendentes',
    color: '#3169CC',
    icon: <PendingActions />,
  },
  in_progress: {
    title: 'Em Andamento',
    color: '#6448BE',
    icon: <PlayCircleOutline />,
  },
  completed: {
    title: 'Concluídas',
    color: '#3AAD0493',
    icon: <DoneAll />,
  },
};

export const MyDayPage = () => {
  const { user } = useAuth();
  const { tasks, loading, deleteTask, updateTask, moveTaskToNextDay } =
    useTasks(user?.id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Filtrar tarefas do dia atual
  const todayTasks = tasks.filter(task => {
    const taskDate = dayjs(task.due_date);
    const today = dayjs();
    return taskDate.isSame(today, 'day');
  });

  // Função para obter tarefas por status
  const getTasksByStatus = (status: string) => {
    return todayTasks.filter(task => task.status === status);
  };

  // Função para lidar com drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = todayTasks.find(t => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as
      | 'todo'
      | 'in_progress'
      | 'completed';

    if (task.status !== newStatus) {
      await updateTask(task.id, { status: newStatus });
    }
  };

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

  const handleViewTask = () => {
    if (selectedTask) {
      setPreviewTask(selectedTask);
      handleMenuClose();
    }
  };

  const handlePreviewTask = (task: Task) => {
    setPreviewTask(task);
  };

  const handleEditFromPreview = () => {
    if (previewTask) {
      setEditingTask(previewTask);
      setPreviewTask(null);
    }
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
        <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 2 }}>
          Suas tarefas para hoje - {dayjs().format('DD/MM/YYYY')}
        </Typography>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card de Progresso */}
        {todayTasks.length > 0 && (
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  transform: 'translate(100px, -100px)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                  >
                    Progresso do Dia
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {
                      todayTasks.filter(task => task.status === 'completed')
                        .length
                    }{' '}
                    de {todayTasks.length} tarefas concluídas
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      lineHeight: 1,
                    }}
                  >
                    {Math.round(
                      (todayTasks.filter(task => task.status === 'completed')
                        .length /
                        todayTasks.length) *
                        100
                    )}
                    %
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Concluído
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Kanban Board */}
      {todayTasks.length === 0 ? (
        <Alert
          severity="info"
          sx={{ backgroundColor: '#1e1e1e', color: '#b0b0b0' }}
        >
          Nenhuma tarefa para hoje. Que tal criar uma nova?
        </Alert>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              minHeight: '400px',
            }}
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <Box key={status} minWidth={300} flex={1}>
                <Card
                  sx={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: '1px solid #333',
                      backgroundColor: config.color,
                      background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {config.icon}
                      <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        {config.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      {getTasksByStatus(status).length} tarefas
                    </Typography>
                  </Box>

                  <Droppable droppableId={status}>
                    {(provided: any, snapshot: any) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          flex: 1,
                          p: 2,
                          minHeight: '200px',
                          backgroundColor: snapshot.isDraggingOver
                            ? '#2a2a2a'
                            : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {getTasksByStatus(status).length === 0 ? (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              color: '#666',
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="body2">
                              Nenhuma tarefa
                            </Typography>
                          </Box>
                        ) : (
                          getTasksByStatus(status).map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided: any, snapshot: any) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    mb: 2,
                                    cursor: snapshot.isDragging
                                      ? 'grabbing'
                                      : 'grab',
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                    transform: snapshot.isDragging
                                      ? 'rotate(5deg) scale(1.05)'
                                      : 'none',
                                    backgroundColor: '#2a2a2a',
                                    border: snapshot.isDragging
                                      ? '2px solid #1976d2'
                                      : '1px solid #333',
                                    borderRadius: 2,
                                    boxShadow: snapshot.isDragging
                                      ? '0 8px 25px rgba(25, 118, 210, 0.3)'
                                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      backgroundColor: '#333',
                                      transform: 'translateY(-2px)',
                                      boxShadow:
                                        '0 4px 12px rgba(0, 0, 0, 0.2)',
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
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          color: 'white',
                                          flex: 1,
                                          textDecoration:
                                            task.status === 'completed'
                                              ? 'line-through'
                                              : 'none',
                                          opacity:
                                            task.status === 'completed'
                                              ? 0.7
                                              : 1,
                                        }}
                                      >
                                        {task.title}
                                      </Typography>

                                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {/* Checkbox para marcar como concluída */}
                                        <IconButton
                                          size="small"
                                          onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleCompleteTask(task);
                                          }}
                                          sx={{
                                            color:
                                              task.status === 'completed'
                                                ? '#4caf50'
                                                : '#b0b0b0',
                                            '&:hover': {
                                              color:
                                                task.status === 'completed'
                                                  ? '#4caf50'
                                                  : '#4caf50',
                                              backgroundColor:
                                                'rgba(76, 175, 80, 0.1)',
                                            },
                                          }}
                                        >
                                          {task.status === 'completed' ? (
                                            <CheckBox fontSize="small" />
                                          ) : (
                                            <CheckBoxOutlineBlank fontSize="small" />
                                          )}
                                        </IconButton>

                                        <IconButton
                                          size="small"
                                          onClick={(
                                            e: React.MouseEvent<HTMLElement>
                                          ) => handleMenuOpen(e, task)}
                                          sx={{ color: '#b0b0b0' }}
                                        >
                                          <MoreVert fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                    {task.description && (
                                      <Box
                                        sx={{
                                          color: '#b0b0b0',
                                          mb: 2,
                                          fontSize: '0.875rem',
                                        }}
                                      >
                                        {task.description.length > 100
                                          ? `${task.description.substring(
                                              0,
                                              100
                                            )}...`
                                          : task.description}
                                      </Box>
                                    )}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 2,
                                      }}
                                    >
                                      <Schedule
                                        fontSize="small"
                                        sx={{ color: '#b0b0b0' }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ color: '#b0b0b0' }}
                                      >
                                        {formatTaskTime(task)}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                        mb: task.status !== 'completed' ? 2 : 0,
                                      }}
                                    >
                                      <Chip
                                        label={task.priority}
                                        size="small"
                                        sx={{
                                          backgroundColor:
                                            priorityColors[task.priority],
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
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Card>
              </Box>
            ))}
          </Box>
        </DragDropContext>
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
        <MenuItem onClick={handleViewTask}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Visualizar</ListItemText>
        </MenuItem>

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
          <ListItemText>Mover para Em Andamento</ListItemText>
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

      {previewTask && (
        <TaskPreview
          open={Boolean(previewTask)}
          onClose={() => setPreviewTask(null)}
          task={previewTask}
          onEdit={handleEditFromPreview}
        />
      )}
    </Box>
  );
};
