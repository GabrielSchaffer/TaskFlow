import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import { ViewKanban, CalendarMonth, ViewList, Add } from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { KanbanView } from '../components/Views/KanbanView';
import { CalendarView } from '../components/Views/CalendarView';
import { ListView } from '../components/Views/ListView';
import { TaskForm } from '../components/Tasks/TaskForm';

type ViewMode = 'kanban' | 'calendar' | 'list';

export const TasksPage = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.id || '');

  // Função para obter o modo de visualização do localStorage ou usar o padrão
  const getInitialViewMode = (): ViewMode => {
    const savedViewMode = localStorage.getItem('taskflow-view-mode');
    if (
      savedViewMode &&
      ['kanban', 'calendar', 'list'].includes(savedViewMode)
    ) {
      return savedViewMode as ViewMode;
    }
    return 'kanban';
  };

  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
      // Persistir o modo de visualização no localStorage
      localStorage.setItem('taskflow-view-mode', newViewMode);
    }
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'kanban':
        return 'Kanban';
      case 'calendar':
        return 'Calendário';
      case 'list':
        return 'Lista';
      default:
        return 'Tarefas';
    }
  };

  const getViewDescription = () => {
    switch (viewMode) {
      case 'kanban':
        return '';
      case 'calendar':
        return '';
      case 'list':
        return '';
      default:
        return '';
    }
  };

  const renderView = () => {
    switch (viewMode) {
      case 'kanban':
        return <KanbanView tasks={tasks} loading={loading} />;
      case 'calendar':
        return <CalendarView tasks={tasks} loading={loading} />;
      case 'list':
        return <ListView tasks={tasks} loading={loading} />;
      default:
        return <KanbanView tasks={tasks} loading={loading} />;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      {/* Header Moderno com Filtros */}
      <Box
        sx={{
          p: 4,
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #333',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                mb: 1,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {getViewTitle()}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#b0b0b0',
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {getViewDescription()}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowTaskForm(true)}
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                backgroundColor: '#1565c0',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Nova Tarefa
          </Button>
        </Box>

        {/* Filtros de Visualização Modernos */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            p: 2,
            backgroundColor: '#2a2a2a',
            borderRadius: 2,
            border: '1px solid #333',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#e0e0e0',
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Modo de Visualização
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="modo de visualização"
            sx={{
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              p: 0.5,
              '& .MuiToggleButton-root': {
                color: '#b0b0b0',
                border: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 1,
                minWidth: 120,
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease-in-out',
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  },
                },
                '&:hover': {
                  backgroundColor: '#333',
                  color: '#e0e0e0',
                },
                '&:not(.Mui-selected)': {
                  '&:hover': {
                    backgroundColor: '#333',
                    color: '#e0e0e0',
                  },
                },
              },
            }}
          >
            <ToggleButton value="kanban" aria-label="kanban">
              <ViewKanban sx={{ mr: 1.5, fontSize: '1.1rem' }} />
              Kanban
            </ToggleButton>
            <ToggleButton value="calendar" aria-label="calendário">
              <CalendarMonth sx={{ mr: 1.5, fontSize: '1.1rem' }} />
              Calendário
            </ToggleButton>
            <ToggleButton value="list" aria-label="lista">
              <ViewList sx={{ mr: 1.5, fontSize: '1.1rem' }} />
              Lista
            </ToggleButton>
          </ToggleButtonGroup>

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: '#1e1e1e',
                borderRadius: 2,
                border: '1px solid #333',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: tasks.length > 0 ? '#4caf50' : '#f44336',
                  animation: tasks.length > 0 ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#e0e0e0',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Conteúdo da Visualização */}
      {renderView()}

      {/* Modal de Nova/Edição de Tarefa */}
      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        userId={user?.id || ''}
      />
    </Box>
  );
};
