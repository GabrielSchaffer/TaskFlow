import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit,
  Delete,
  CheckCircle,
  Star,
  Schedule,
  MoreVert,
  Add,
  Pause,
  PlayArrow,
  Visibility,
} from '@mui/icons-material';
import { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { TaskForm } from '../Tasks/TaskForm';
import { TaskPreview } from '../Tasks/TaskPreview';
import { Confetti } from '../Animations/Confetti';
import { Fireworks } from '../Animations/Fireworks';
import { useCelebration } from '../../hooks/useCelebration';
import dayjs from 'dayjs';

const priorityColors = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#2196f3',
} as const;

const statusColors = {
  todo: '#f44336',
  in_progress: '#ff9800',
  completed: '#4caf50',
} as const;

interface ListViewProps {
  tasks: Task[];
  loading: boolean;
}

export const ListView = ({ tasks, loading }: ListViewProps) => {
  const { user } = useAuth();
  const { deleteTask, updateTask } = useTasks(user?.id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Função para atualizar tarefa com atualização otimista
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
      // Atualizar previewTask se estiver aberto
      if (previewTask && previewTask.id === taskId) {
        const updatedTask = { ...previewTask, ...updates };
        setPreviewTask(updatedTask);
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filteredStage, setFilteredStage] = useState<string | null>(null);

  const {
    showConfetti,
    showFireworks,
    triggerCelebration,
    handleConfettiComplete,
    handleFireworksComplete,
  } = useCelebration();

  // Contar tarefas por etapa
  const todoTasks = tasks.filter((task: Task) => task.status === 'todo');
  const inProgressTasks = tasks.filter(
    (task: Task) => task.status === 'in_progress'
  );
  const completedTasks = tasks.filter(
    (task: Task) => task.status === 'completed'
  );

  // Tarefas filtradas por etapa
  const filteredTasks = filteredStage
    ? tasks.filter((task: Task) => task.status === filteredStage)
    : tasks;

  const handleStageClick = (stage: string) => {
    if (filteredStage === stage) {
      setFilteredStage(null); // Remove filtro se clicar na mesma etapa
    } else {
      setFilteredStage(stage); // Aplica filtro
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

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, { status: 'completed' });
    // Trigger celebration when completing a task
    triggerCelebration();
  };

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diffDays = date.diff(now, 'day');

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
    return `Em ${diffDays} dias`;
  };

  const isOverdue = (dateString: string) => {
    return dayjs(dateString).isBefore(dayjs(), 'day');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ backgroundColor: 'background.default' }}
      >
        <Typography variant="h6" sx={{ color: '#b0b0b0' }}>
          Carregando tarefas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: 'background.default',
      minHeight: '100vh', 
      p: { xs: 1, sm: 2, md: 3 }, // Padding responsivo
      width: '100%',
      overflow: 'hidden', // Evita overflow horizontal
    }}>
      {/* Cards de Etapas */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              backgroundColor: filteredStage === 'todo' ? '#2a2a2a' : '#1e1e1e',
              border:
                filteredStage === 'todo'
                  ? '2px solid #f44336'
                  : '1px solid #333',
              '&:hover': {
                backgroundColor: '#2a2a2a',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={() => handleStageClick('todo')}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Pause sx={{ color: '#f44336', fontSize: '1.5rem' }} />
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    A Fazer
                  </Typography>
                </Box>
                <Chip
                  label={todoTasks.length}
                  size="small"
                  sx={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tarefas pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              backgroundColor:
                filteredStage === 'in_progress' ? '#2a2a2a' : '#1e1e1e',
              border:
                filteredStage === 'in_progress'
                  ? '2px solid #ff9800'
                  : '1px solid #333',
              '&:hover': {
                backgroundColor: '#2a2a2a',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={() => handleStageClick('in_progress')}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayArrow sx={{ color: '#ff9800', fontSize: '1.5rem' }} />
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Em Andamento
                  </Typography>
                </Box>
                <Chip
                  label={inProgressTasks.length}
                  size="small"
                  sx={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tarefas em execução
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              backgroundColor:
                filteredStage === 'completed' ? '#2a2a2a' : '#1e1e1e',
              border:
                filteredStage === 'completed'
                  ? '2px solid #4caf50'
                  : '1px solid #333',
              '&:hover': {
                backgroundColor: '#2a2a2a',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={() => handleStageClick('completed')}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#4caf50', fontSize: '1.5rem' }} />
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Concluídas
                  </Typography>
                </Box>
                <Chip
                  label={completedTasks.length}
                  size="small"
                  sx={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tarefas finalizadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Tarefas */}
      {filteredTasks.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Nenhuma tarefa encontrada
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
            Crie sua primeira tarefa para começar a organizar seu dia
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
            Criar Primeira Tarefa
          </Button>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ 
            backgroundColor: '#1e1e1e', 
            border: '1px solid #333',
            overflow: 'auto', // Permite scroll horizontal se necessário
            width: '100%',
          }}
        >
          <Table sx={{ minWidth: { xs: 600, sm: 800 } }}> {/* Largura mínima responsiva */}
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    minWidth: { xs: 120, sm: 150 }, // Largura mínima responsiva
                  }}
                >
                  Tarefa
                </TableCell>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    display: { xs: 'none', sm: 'table-cell' }, // Escondido em mobile
                    minWidth: 200,
                  }}
                >
                  Descrição
                </TableCell>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    display: { xs: 'none', md: 'table-cell' }, // Escondido em mobile e tablet
                    minWidth: 100,
                  }}
                >
                  Categoria
                </TableCell>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    minWidth: 80,
                  }}
                >
                  Prioridade
                </TableCell>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    minWidth: 100,
                  }}
                >
                  Etapa
                </TableCell>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    display: { xs: 'none', sm: 'table-cell' }, // Escondido em mobile
                    minWidth: 100,
                  }}
                >
                  Data
                </TableCell>
                <TableCell
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 600,
                    borderColor: '#333',
                    minWidth: 80,
                  }}
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow
                  key={task.id}
                  onClick={() => handlePreviewTask(task)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                    },
                    ...(task.important && {
                      borderLeft: '4px solid #ff9800',
                    }),
                  }}
                >
                  {/* Título da Tarefa */}
                  <TableCell sx={{ borderColor: '#333' }}>
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        {task.important && (
                          <Star sx={{ color: '#ff9800', fontSize: '1rem' }} />
                        )}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            textDecoration:
                              task.status === 'completed'
                                ? 'line-through'
                                : 'none',
                            opacity: task.status === 'completed' ? 0.7 : 1,
                          }}
                        >
                          {task.title}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Descrição da Tarefa */}
                  <TableCell sx={{ 
                    borderColor: '#333',
                    display: { xs: 'none', sm: 'table-cell' }, // Escondido em mobile
                  }}>
                    {task.description ? (
                      <Box
                        sx={{
                          color: '#b0b0b0',
                          fontSize: '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
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
                            paddingLeft: '12px',
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
                              ? `${task.description.substring(0, 100)}...`
                              : task.description,
                        }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontStyle: 'italic',
                        }}
                      >
                        Sem descrição
                      </Typography>
                    )}
                  </TableCell>

                  {/* Categoria */}
                  <TableCell sx={{ 
                    borderColor: '#333',
                    display: { xs: 'none', md: 'table-cell' }, // Escondido em mobile e tablet
                  }}>
                    {task.category && (
                      <Chip
                        label={task.category}
                        size="small"
                        sx={{
                          backgroundColor: '#444',
                          color: '#e0e0e0',
                          border: '1px solid #555',
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Prioridade */}
                  <TableCell sx={{ borderColor: '#333' }}>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        backgroundColor: priorityColors[task.priority],
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>

                  {/* Etapa */}
                  <TableCell sx={{ borderColor: '#333' }}>
                    <Chip
                      label={
                        task.status === 'todo'
                          ? 'A Fazer'
                          : task.status === 'in_progress'
                          ? 'Em Andamento'
                          : 'Concluída'
                      }
                      size="small"
                      sx={{
                        backgroundColor: statusColors[task.status],
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 1.5,
                        },
                      }}
                    />
                  </TableCell>

                  {/* Data */}
                  <TableCell sx={{ 
                    borderColor: '#333',
                    display: { xs: 'none', sm: 'table-cell' }, // Escondido em mobile
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule fontSize="small" sx={{ color: '#b0b0b0' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: isOverdue(task.due_date)
                            ? '#f44336'
                            : '#b0b0b0',
                          fontWeight: isOverdue(task.due_date) ? 600 : 400,
                        }}
                      >
                        {formatDate(task.due_date)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Ações */}
                  <TableCell sx={{ borderColor: '#333' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Concluir">
                        <IconButton
                          size="small"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleCompleteTask(task);
                          }}
                          disabled={task.status === 'completed'}
                          sx={{
                            color:
                              task.status === 'completed'
                                ? '#4caf50'
                                : '#1976d2',
                            '&:hover': {
                              backgroundColor:
                                task.status === 'completed'
                                  ? 'rgba(76, 175, 80, 0.1)'
                                  : 'rgba(25, 118, 210, 0.1)',
                            },
                          }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Mais opções">
                        <IconButton
                          size="small"
                          onClick={(e: React.MouseEvent<HTMLElement>) => {
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
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          // Forçar atualização da lista
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
                due_date: new Date().toISOString(),
                priority: 'Média' as const,
                category: '',
                important: false,
                status: 'todo' as const,
              }
        }
      />

      {previewTask && (
        <TaskPreview
          open={Boolean(previewTask)}
          onClose={() => setPreviewTask(null)}
          task={previewTask}
          onEdit={handleEditFromPreview}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {/* Celebration Animations */}
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />
      <Fireworks trigger={showFireworks} onComplete={handleFireworksComplete} />
    </Box>
  );
};
