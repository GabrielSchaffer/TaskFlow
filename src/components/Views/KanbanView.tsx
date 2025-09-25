import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  PlayArrow,
  Pause,
  Visibility,
} from '@mui/icons-material';
import { Task, TaskStatus } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { TaskForm } from '../Tasks/TaskForm';
import { TaskPreview } from '../Tasks/TaskPreview';

interface KanbanViewProps {
  tasks: Task[];
  loading: boolean;
}

const statusConfig = {
  todo: {
    title: 'A Fazer',
    color: 'default' as const,
    icon: <Pause />,
  },
  in_progress: {
    title: 'Em Andamento',
    color: 'warning' as const,
    icon: <PlayArrow />,
  },
  completed: {
    title: 'Concluído',
    color: 'success' as const,
    icon: <CheckCircle />,
  },
};

const priorityColors = {
  Alta: 'error',
  Média: 'warning',
  Baixa: 'info',
} as const;

export const KanbanView = ({ tasks, loading }: KanbanViewProps) => {
  const { updateTask, deleteTask } = useTasks(tasks[0]?.user_id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Sincronizar estado local com tasks
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const task = localTasks.find(t => t.id === draggableId);

    if (task && task.status !== newStatus) {
      // Atualização otimista - atualizar UI imediatamente
      setLocalTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === draggableId
            ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
            : t
        )
      );

      try {
        // Atualizar no banco de dados
        const result = await updateTask(task.id, { status: newStatus });

        if (result.error) {
          // Reverter mudança se houver erro
          setLocalTasks(prevTasks =>
            prevTasks.map(t =>
              t.id === draggableId ? { ...t, status: task.status } : t
            )
          );
        }
      } catch (error) {
        // Reverter mudança se houver erro
        setLocalTasks(prevTasks =>
          prevTasks.map(t =>
            t.id === draggableId ? { ...t, status: task.status } : t
          )
        );
      }
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

  const handleEdit = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      handleMenuClose();
    }
  };

  const handleDelete = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id);
      handleMenuClose();
    }
  };

  const handleMoveToNextStage = async () => {
    if (selectedTask) {
      let newStatus: TaskStatus;

      if (selectedTask.status === 'todo') {
        newStatus = 'in_progress';
      } else if (selectedTask.status === 'in_progress') {
        newStatus = 'completed';
      } else {
        return;
      }

      // Atualização otimista
      setLocalTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === selectedTask.id
            ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
            : t
        )
      );

      try {
        await updateTask(selectedTask.id, { status: newStatus });
      } catch (error) {
        // Reverter mudança se houver erro
        setLocalTasks(prevTasks =>
          prevTasks.map(t =>
            t.id === selectedTask.id ? { ...t, status: selectedTask.status } : t
          )
        );
      }

      handleMenuClose();
    }
  };

  const handleMoveToPreviousStage = async () => {
    if (selectedTask) {
      let newStatus: TaskStatus;

      if (selectedTask.status === 'completed') {
        newStatus = 'in_progress';
      } else if (selectedTask.status === 'in_progress') {
        newStatus = 'todo';
      } else {
        return;
      }

      // Atualização otimista
      setLocalTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === selectedTask.id
            ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
            : t
        )
      );

      try {
        await updateTask(selectedTask.id, { status: newStatus });
      } catch (error) {
        // Reverter mudança se houver erro
        setLocalTasks(prevTasks =>
          prevTasks.map(t =>
            t.id === selectedTask.id ? { ...t, status: selectedTask.status } : t
          )
        );
      }

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

  const handleViewTask = () => {
    if (selectedTask) {
      setPreviewTask(selectedTask);
      handleMenuClose();
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return localTasks.filter(task => task.status === status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const isOverdue = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" gap={2} overflow="auto" minHeight="70vh">
          {Object.entries(statusConfig).map(([status, config]) => (
            <Box key={status} minWidth={300} flex={1}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {config.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {config.title}
                    </Typography>
                    <Chip
                      label={getTasksByStatus(status as TaskStatus).length}
                      color={config.color}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>

                  <Droppable droppableId={status}>
                    {(provided: any, snapshot: any) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          minHeight: 200,
                          bgcolor: snapshot.isDraggingOver
                            ? 'rgba(25, 118, 210, 0.1)'
                            : 'transparent',
                          borderRadius: 2,
                          border: snapshot.isDraggingOver
                            ? '2px dashed #1976d2'
                            : '2px dashed transparent',
                          transition: 'all 0.2s ease-in-out',
                          p: 1,
                        }}
                      >
                        {getTasksByStatus(status as TaskStatus).length === 0 ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: 100,
                              color: '#b0b0b0',
                              fontSize: '0.875rem',
                              textAlign: 'center',
                              border: '2px dashed #333',
                              borderRadius: 2,
                              backgroundColor: '#1a1a1a',
                            }}
                          >
                            Arraste tarefas para cá
                          </Box>
                        ) : (
                          getTasksByStatus(status as TaskStatus).map(
                            (task, index) => (
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
                                    onClick={() => handlePreviewTask(task)}
                                    sx={{
                                      mb: 2,
                                      cursor: snapshot.isDragging
                                        ? 'grabbing'
                                        : 'pointer',
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
                                        boxShadow:
                                          '0 4px 12px rgba(0, 0, 0, 0.2)',
                                        transform: 'translateY(-2px)',
                                      },
                                      ...(task.important && {
                                        borderLeft: '4px solid #ff9800',
                                      }),
                                    }}
                                  >
                                    <CardContent sx={{ p: 2.5 }}>
                                      {/* Header com título e menu */}
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        mb={1.5}
                                      >
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            lineHeight: 1.3,
                                            flex: 1,
                                            pr: 1,
                                          }}
                                        >
                                          {task.title}
                                        </Typography>
                                        <IconButton
                                          size="small"
                                          onClick={(
                                            e: React.MouseEvent<HTMLElement>
                                          ) => {
                                            e.stopPropagation();
                                            handleMenuOpen(e, task);
                                          }}
                                          sx={{
                                            color: '#b0b0b0',
                                            '&:hover': {
                                              backgroundColor: '#444',
                                              color: 'white',
                                            },
                                          }}
                                        >
                                          <MoreVert fontSize="small" />
                                        </IconButton>
                                      </Box>

                                      {/* Descrição */}
                                      {task.description && (
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: '#b0b0b0',
                                            mb: 2,
                                            lineHeight: 1.4,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          {task.description.length > 100
                                            ? `${task.description.substring(
                                                0,
                                                100
                                              )}...`
                                            : task.description}
                                        </Typography>
                                      )}

                                      {/* Tags e informações */}
                                      <Box
                                        display="flex"
                                        gap={1}
                                        flexWrap="wrap"
                                        alignItems="center"
                                      >
                                        {/* Categoria */}
                                        {task.category && (
                                          <Chip
                                            label={task.category}
                                            size="small"
                                            sx={{
                                              backgroundColor: '#444',
                                              color: '#e0e0e0',
                                              border: '1px solid #555',
                                              fontSize: '0.75rem',
                                              height: 24,
                                              '& .MuiChip-label': {
                                                px: 1,
                                              },
                                            }}
                                          />
                                        )}

                                        {/* Prioridade */}
                                        <Chip
                                          label={task.priority}
                                          size="small"
                                          sx={{
                                            backgroundColor:
                                              priorityColors[task.priority],
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            height: 24,
                                            fontWeight: 500,
                                            '& .MuiChip-label': {
                                              px: 1,
                                            },
                                          }}
                                        />

                                        {/* Data */}
                                        <Chip
                                          label={formatDate(task.due_date)}
                                          size="small"
                                          sx={{
                                            backgroundColor: isOverdue(
                                              task.due_date
                                            )
                                              ? '#f44336'
                                              : '#333',
                                            color: isOverdue(task.due_date)
                                              ? 'white'
                                              : '#b0b0b0',
                                            border: isOverdue(task.due_date)
                                              ? 'none'
                                              : '1px solid #555',
                                            fontSize: '0.75rem',
                                            height: 24,
                                            '& .MuiChip-label': {
                                              px: 1,
                                            },
                                          }}
                                        />

                                        {/* Importante */}
                                        {task.important && (
                                          <Chip
                                            label="⭐ Importante"
                                            size="small"
                                            sx={{
                                              backgroundColor: '#ff9800',
                                              color: 'white',
                                              fontSize: '0.75rem',
                                              height: 24,
                                              fontWeight: 500,
                                              '& .MuiChip-label': {
                                                px: 1,
                                              },
                                            }}
                                          />
                                        )}
                                      </Box>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            )
                          )
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </DragDropContext>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2a2a2a',
            border: '1px solid #333',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleViewTask}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText>Visualizar</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        {/* Opções baseadas no status atual */}
        {selectedTask && (
          <>
            {selectedTask.status === 'todo' && (
              <MenuItem onClick={handleMoveToNextStage}>
                <ListItemIcon>
                  <PlayArrow />
                </ListItemIcon>
                <ListItemText>Mover para Em Andamento</ListItemText>
              </MenuItem>
            )}

            {selectedTask.status === 'in_progress' && (
              <MenuItem onClick={handleMoveToNextStage}>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText>Marcar como Concluída</ListItemText>
              </MenuItem>
            )}

            {selectedTask.status === 'completed' && (
              <MenuItem onClick={handleMoveToPreviousStage}>
                <ListItemIcon>
                  <Pause />
                </ListItemIcon>
                <ListItemText>Voltar para Em Andamento</ListItemText>
              </MenuItem>
            )}
          </>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {editingTask && (
        <TaskForm
          open={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          userId={editingTask.user_id}
          taskId={editingTask.id}
          onTaskUpdated={() => {
            // Forçar atualização do estado local
            setLocalTasks(tasks);
          }}
          initialData={{
            title: editingTask.title,
            description: editingTask.description || '',
            due_date: editingTask.due_date,
            priority: editingTask.priority,
            category: editingTask.category,
            important: editingTask.important,
            status: editingTask.status,
          }}
        />
      )}

      {previewTask && (
        <TaskPreview
          open={Boolean(previewTask)}
          onClose={() => setPreviewTask(null)}
          task={previewTask}
          onEdit={handleEditFromPreview}
        />
      )}
    </>
  );
};
