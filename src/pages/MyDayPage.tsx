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
import { KanbanBoard } from '../components/Kanban/KanbanBoard';
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
       

      {/* Kanban Board */}
      <KanbanBoard
        tasks={todayTasks}
        onUpdateTask={async (taskId, updates) => {
          await updateTask(taskId, updates);
        }}
        onDeleteTask={async (taskId) => {
          await deleteTask(taskId);
        }}
        onMoveToNextDay={async (taskId) => {
          await moveTaskToNextDay(taskId);
        }}
        showProgress={true}
        emptyMessage="Nenhuma tarefa para hoje. Que tal criar uma nova?"
      />

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
