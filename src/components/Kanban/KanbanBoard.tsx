import React, { useState } from 'react';
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
  Alert,
  Button,
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
  CheckBox,
  CheckBoxOutlineBlank,
  Schedule,
  PendingActions,
  PlayCircleOutline,
  DoneAll,
  Add,
} from '@mui/icons-material';
import { Task, TaskStatus } from '../../types';
import { TaskPreview } from '../Tasks/TaskPreview';
import dayjs from 'dayjs';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onMoveToNextDay?: (taskId: string) => Promise<void>;
  showProgress?: boolean; // Para mostrar/esconder o progresso
  emptyMessage?: string;
  onCreateTask?: (status: string) => void; // Callback para criar tarefa
}

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

export const KanbanBoard = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onMoveToNextDay,
  showProgress = true,
  emptyMessage = 'Nenhuma tarefa encontrada.',
  onCreateTask,
}: KanbanBoardProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Função para obter tarefas por status
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
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

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as
      | 'todo'
      | 'in_progress'
      | 'completed';

    if (task.status !== newStatus) {
      await onUpdateTask(task.id, { status: newStatus });
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
      await onDeleteTask(selectedTask.id);
      handleMenuClose();
    }
  };

  const handleMoveToNextDay = async () => {
    if (selectedTask && onMoveToNextDay) {
      await onMoveToNextDay(selectedTask.id);
      handleMenuClose();
    }
  };

  const handleCompleteTask = async (task: Task) => {
    await onUpdateTask(task.id, { status: 'completed' });
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

  // Calcular progresso se necessário
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      {/* Estatísticas de Progresso (opcional) */}
      {showProgress && tasks.length > 0 && (
        <Box sx={{ mb: 4 }}>
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
                  {completedTasks} de {totalTasks} tarefas concluídas
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
                  {progressPercentage}%
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
        </Box>
      )}

      {/* Kanban Board */}
      {tasks.length === 0 ? (
        <Alert
          severity="info"
          sx={{ backgroundColor: '#1e1e1e', color: '#b0b0b0' }}
        >
          {emptyMessage}
        </Alert>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 0.5, sm: 1, md: 2 }, // Gap responsivo
              pb: 2,
              minHeight: '400px',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              px: { xs: 0.5, sm: 1, md: 2 }, // Padding responsivo
              flexDirection: { xs: 'column', sm: 'row' }, // Coluna em mobile, linha em desktop
            }}
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <Box 
                key={status} 
                sx={{ 
                  flex: { xs: 'none', sm: 1 }, // Não flex em mobile, flex em desktop
                  minWidth: { xs: '100%', sm: 0 }, // Largura total em mobile
                  width: { xs: '100%', sm: 'auto' }, // Largura automática em desktop
                  maxWidth: { xs: '100%', sm: 'none' }, // Sem max-width em desktop
                  mb: { xs: 2, sm: 0 }, // Margin bottom em mobile
                }}
              >
                <Card
                  sx={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 2,
                    height: { xs: 'auto', sm: '100%' }, // Altura automática em mobile
                    minHeight: { xs: '300px', sm: '400px' }, // Altura mínima responsiva
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 }, // Padding responsivo
                      px: { xs: 2, sm: 3 }, // Padding horizontal responsivo
                      borderBottom: '1px solid #333',
                      backgroundColor: config.color,
                      background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.5, sm: 1 }, // Gap responsivo
                        mb: 1,
                        flexWrap: 'wrap', // Permite quebra de linha se necessário
                      }}
                    >
                      {config.icon}
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.25rem' }, // Tamanho responsivo
                        }}
                      >
                        {config.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Tamanho responsivo
                      }}
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
                          p: { xs: 1, sm: 2 }, // Padding responsivo
                          minHeight: { xs: '150px', sm: '200px' }, // Altura mínima responsiva
                          backgroundColor: snapshot.isDraggingOver
                            ? '#2a2a2a'
                            : 'transparent',
                          transition: 'background-color 0.2s ease',
                          overflow: 'auto', // Permite scroll se necessário
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
                              gap: 2,
                            }}
                          >
                            <Typography variant="body2">
                              Nenhuma tarefa
                            </Typography>
                            {onCreateTask && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Add />}
                                onClick={() => onCreateTask(status)}
                                sx={{
                                  color: '#b0b0b0',
                                  borderColor: '#555',
                                  '&:hover': {
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                  },
                                }}
                              >
                                Nova Tarefa
                              </Button>
                            )}
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
                                  onClick={() => handlePreviewTask(task)}
                                  sx={{
                                    mb: { xs: 1, sm: 2 }, // Margin responsivo
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
                                    width: '100%', // Garante largura total
                                    maxWidth: '100%', // Evita overflow
                                    '&:hover': {
                                      backgroundColor: '#333',
                                      transform: 'translateY(-2px)',
                                      boxShadow:
                                        '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    },
                                  }}
                                >
                                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 1,
                                        gap: 1, // Gap entre título e botões
                                      }}
                                    >
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          color: 'white',
                                          flex: 1,
                                          fontSize: { xs: '0.9rem', sm: '1.1rem' }, // Tamanho responsivo
                                          lineHeight: 1.3,
                                          textDecoration:
                                            task.status === 'completed'
                                              ? 'line-through'
                                              : 'none',
                                          opacity:
                                            task.status === 'completed'
                                              ? 0.7
                                              : 1,
                                          wordBreak: 'break-word', // Quebra palavras longas
                                        }}
                                      >
                                        {task.title}
                                      </Typography>

                                      <Box sx={{ 
                                        display: 'flex', 
                                        gap: { xs: 0.25, sm: 0.5 }, // Gap responsivo
                                        flexShrink: 0, // Não encolhe os botões
                                      }}>
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
                                          mb: { xs: 1.5, sm: 2 }, // Margin responsivo
                                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Tamanho responsivo
                                          lineHeight: 1.4,
                                          display: '-webkit-box',
                                          WebkitLineClamp: { xs: 1, sm: 2 }, // 1 linha em mobile, 2 em desktop
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          px: { xs: 0.5, sm: 1 }, // Padding responsivo
                                          py: { xs: 0.25, sm: 0.5 }, // Padding vertical responsivo
                                          wordBreak: 'break-word', // Quebra palavras longas
                                        }}
                                      >
                                        {/* Remove HTML tags and show only text */}
                                        {task.description
                                          .replace(/<[^>]*>/g, '') // Remove all HTML tags
                                          .substring(0, 80) // Limite fixo mais conservador
                                          .trim()}
                                        {task.description.replace(/<[^>]*>/g, '').length > 80 && '...'}
                                      </Box>
                                    )}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 0.5, sm: 1 }, // Gap responsivo
                                        mb: { xs: 1.5, sm: 2 }, // Margin responsivo
                                      }}
                                    >
                                      <Schedule
                                        fontSize="small"
                                        sx={{ color: '#b0b0b0' }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ 
                                          color: '#b0b0b0',
                                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Tamanho responsivo
                                        }}
                                      >
                                        {formatTaskTime(task)}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        gap: { xs: 0.5, sm: 1 }, // Gap responsivo
                                        flexWrap: 'wrap',
                                        mb: task.status !== 'completed' ? { xs: 1.5, sm: 2 } : 0, // Margin responsivo
                                      }}
                                    >
                                      <Chip
                                        label={task.priority}
                                        size="small"
                                        sx={{
                                          backgroundColor:
                                            priorityColors[task.priority],
                                          color: 'white',
                                          fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Tamanho responsivo
                                          height: { xs: 20, sm: 24 }, // Altura responsiva
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
                                            fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Tamanho responsivo
                                            height: { xs: 20, sm: 24 }, // Altura responsiva
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
                                            fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Tamanho responsivo
                                            height: { xs: 20, sm: 24 }, // Altura responsiva
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

        {onMoveToNextDay && (
          <MenuItem onClick={handleMoveToNextDay}>
            <ListItemIcon>
              <PlayArrow fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mover para Em Andamento</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleDeleteTask} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

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
