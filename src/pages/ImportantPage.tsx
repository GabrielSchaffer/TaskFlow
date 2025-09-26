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
  Star,
  Schedule,
  Assignment,
  DoneAll,
  PendingActions,
  MoreVert,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { TaskPreview } from '../components/Tasks/TaskPreview';
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

export const ImportantPage = () => {
  const { user } = useAuth();
  const { tasks, loading, deleteTask, updateTask, moveTaskToNextDay } =
    useTasks(user?.id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);

  // Filtrar tarefas importantes
  const importantTasks = tasks.filter(task => task.important);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const task = importantTasks.find(t => t.id === draggableId);
    if (!task) return;
    const newStatus = destination.droppableId as
      | 'todo'
      | 'in_progress'
      | 'completed';
    if (task.status !== newStatus) {
      await updateTask(task.id, { status: newStatus });
    }
  };

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, { status: 'completed' });
  };

  const handleViewTask = (task: Task) => {
    setPreviewTask(task);
  };

  const handlePreviewTask = (task: Task) => {
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

  const handleMoveToNextDay = async () => {
    if (selectedTask) {
      await moveTaskToNextDay(selectedTask.id);
      handleMenuClose();
    }
  };

  const formatTaskTime = (task: Task) => {
    const taskDate = dayjs(task.due_date);
    return taskDate.format('DD/MM/YYYY HH:mm');
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
      {/* Kanban Board - Coluna Única */}
      {importantTasks.length === 0 ? (
        <Alert
          severity="info"
          sx={{ backgroundColor: '#1e1e1e', color: '#b0b0b0' }}
        >
          Nenhuma tarefa marcada como importante. Marque algumas tarefas como
          importantes para vê-las aqui.
        </Alert>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: 3, minHeight: '400px' }}>
            {/* Coluna de Tarefas Importantes */}
            <Droppable droppableId="important" direction="vertical">
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    // backgroundColor: '#1e1e1e',
                    borderRadius: 3,
                    p: 2,
                    // border: '1px solid #FF99004E',
                    // boxShadow: '0 0 1px 0 #FF99004E',
                    minHeight: '400px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#ffb74d',
                    },
                  }}
                >
                  {/* Cabeçalho da Coluna */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                      pb: 2,
                      borderBottom: '1px solid #333',
                    }}
                  >
                    <Star sx={{ color: '#ff9800', fontSize: '1.7rem' }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '24px',
                      }}
                    >
                      Tarefas Importantes
                    </Typography>
                    <Chip
                      label={importantTasks.length}
                      size="small"
                      sx={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  {/* Lista de Tarefas */}
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    {importantTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              backgroundColor: '#2a2a2a',
                              border: '2px solid #ff9800',
                              borderRadius: 2,
                              position: 'relative',
                              overflow: 'hidden',
                              transition: 'all 0.2s ease',
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transform: snapshot.isDragging
                                ? 'rotate(2deg) scale(1.02)'
                                : 'none',
                              '&:hover': {
                                backgroundColor: '#333',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
                                borderColor: '#ffb74d',
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background:
                                  'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
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
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flex: 1,
                                  }}
                                >
                                  <Star
                                    sx={{
                                      color: '#ff9800',
                                      fontSize: '1.4rem',
                                      filter:
                                        'drop-shadow(0 0 4px rgba(255, 152, 0, 0.5))',
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: 'white',
                                      fontWeight: 'bold',
                                      textShadow:
                                        '0 1px 2px rgba(0, 0, 0, 0.3)',
                                    }}
                                  >
                                    {task.title}
                                  </Typography>
                                </Box>

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
                                <Box
                                  sx={{
                                    color: '#b0b0b0',
                                    mb: 2,
                                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                                      color: '#b0b0b0',
                                      margin: '4px 0',
                                      fontSize: '0.875rem',
                                    },
                                    '& p': {
                                      color: '#b0b0b0',
                                      margin: '2px 0',
                                      fontSize: '0.875rem',
                                    },
                                    '& strong, & b': {
                                      fontWeight: 'bold',
                                      color: '#b0b0b0',
                                    },
                                    '& em, & i': {
                                      fontStyle: 'italic',
                                      color: '#b0b0b0',
                                    },
                                    '& u': {
                                      textDecoration: 'underline',
                                      color: '#b0b0b0',
                                    },
                                    '& s, & strike': {
                                      textDecoration: 'line-through',
                                      color: '#b0b0b0',
                                    },
                                    '& a': {
                                      color: '#64b5f6',
                                      textDecoration: 'underline',
                                    },
                                    '& ul, & ol': {
                                      paddingLeft: '16px',
                                      color: '#b0b0b0',
                                    },
                                    '& li': {
                                      color: '#b0b0b0',
                                      margin: '1px 0',
                                    },
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      task.description.length > 100
                                        ? `${task.description.substring(
                                            0,
                                            100
                                          )}...`
                                        : task.description,
                                  }}
                                />
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
                                  mb: 2,
                                }}
                              >
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      priorityColors[task.priority],
                                    color: 'white',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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

                                <Chip
                                  label="⭐ Importante"
                                  size="small"
                                  sx={{
                                    background:
                                      'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    boxShadow:
                                      '0 2px 8px rgba(255, 152, 0, 0.3)',
                                    '&:hover': {
                                      boxShadow:
                                        '0 4px 12px rgba(255, 152, 0, 0.4)',
                                    },
                                  }}
                                />

                                <Chip
                                  label={
                                    task.status === 'todo'
                                      ? 'Pendente'
                                      : task.status === 'in_progress'
                                      ? 'Em Andamento'
                                      : 'Concluída'
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      task.status === 'completed'
                                        ? '#4caf50'
                                        : task.status === 'in_progress'
                                        ? '#ff9800'
                                        : '#f44336',
                                    color: 'white',
                                    fontWeight: 'bold',
                                  }}
                                />
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
                                      task.status === 'completed'
                                        ? '#4caf50'
                                        : '#1976d2',
                                    borderColor:
                                      task.status === 'completed'
                                        ? '#4caf50'
                                        : '#1976d2',
                                    '&:hover': {
                                      borderColor:
                                        task.status === 'completed'
                                          ? '#4caf50'
                                          : '#1565c0',
                                    },
                                  }}
                                >
                                  {task.status === 'completed'
                                    ? 'Concluída'
                                    : 'Concluir'}
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                </Box>
              )}
            </Droppable>
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
                due_date: dayjs().add(1, 'day').toISOString(),
                priority: 'Média',
                category: '',
                important: true, // Nova tarefa criada na página importante já vem marcada como importante
                status: 'todo',
              }
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
