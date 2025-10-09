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
  Add,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import { Task, TaskStatus } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { TaskForm } from '../Tasks/TaskForm';
import { TaskPreview } from '../Tasks/TaskPreview';
import { KanbanBoard } from '../Kanban/KanbanBoard';
import { Confetti } from '../Animations/Confetti';
import { Fireworks } from '../Animations/Fireworks';
import { useCelebration } from '../../hooks/useCelebration';

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
  const [creatingTaskForStatus, setCreatingTaskForStatus] =
    useState<TaskStatus | null>(null);
  const [quickLoading, setQuickLoading] = useState(false);

  const {
    showConfetti,
    showFireworks,
    triggerCelebration,
    handleConfettiComplete,
    handleFireworksComplete,
  } = useCelebration();

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
      // Trigger celebration when completing a task
      if (newStatus === 'completed') {
        triggerCelebration();
      }

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
        // Trigger celebration when completing a task
        triggerCelebration();
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

  const handleCreateTask = (status: TaskStatus) => {
    setCreatingTaskForStatus(status);
  };

  const handleTaskCreated = () => {
    setCreatingTaskForStatus(null);
  };

  const handleTaskUpdated = () => {
    // Forçar atualização da página para mostrar a nova tarefa
    window.location.reload();
  };

  const triggerQuickLoading = () => {
    setQuickLoading(true);
    setTimeout(() => {
      setQuickLoading(false);
    }, 100); // Loading de apenas 100ms
  };

  const handleViewTask = () => {
    if (selectedTask) {
      setPreviewTask(selectedTask);
      handleMenuClose();
    }
  };

  const handleCompleteTask = async (task: Task) => {
    // Trigger celebration when completing a task
    triggerCelebration();

    // Atualização otimista
    setLocalTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === task.id
          ? {
              ...t,
              status: 'completed' as TaskStatus,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    try {
      await updateTask(task.id, { status: 'completed' });
    } catch (error) {
      // Reverter mudança se houver erro
      setLocalTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === task.id ? { ...t, status: task.status } : t
        )
      );
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
      {quickLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      
      <KanbanBoard
        tasks={localTasks}
        onUpdateTask={async (taskId, updates) => {
          await updateTask(taskId, updates);
        }}
        onDeleteTask={async (taskId) => {
          await deleteTask(taskId);
        }}
        onCreateTask={(status) => handleCreateTask(status as TaskStatus)}
        showProgress={false} // SEM progresso no modo Kanban
        emptyMessage="Nenhuma tarefa encontrada. Que tal criar uma nova?"
      />

      {/* Celebration Animations */}
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />
      <Fireworks trigger={showFireworks} onComplete={handleFireworksComplete} />

      {/* Task Form Modal */}
      <TaskForm
        open={Boolean(creatingTaskForStatus)}
        onClose={() => setCreatingTaskForStatus(null)}
        userId={tasks[0]?.user_id || ''}
        onTaskUpdated={handleTaskUpdated}
        initialData={
          creatingTaskForStatus
            ? {
                title: '',
                description: '',
                due_date: new Date().toISOString(),
                priority: 'Média' as const,
                category: '',
                important: false,
                status: creatingTaskForStatus,
              }
            : undefined
        }
      />
    </>
  );
};
