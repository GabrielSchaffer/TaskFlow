import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../contexts/ThemeContext';
import { KanbanView } from '../components/Views/KanbanView';
import { CalendarView } from '../components/Views/CalendarView';
import { ListView } from '../components/Views/ListView';
import { TaskForm } from '../components/Tasks/TaskForm';

type ViewMode = 'kanban' | 'calendar' | 'list';

export const TasksPage = () => {
  const { user } = useAuth();
  const { colorTheme } = useTheme();
  const { tasks, loading, createTask, updateTask, deleteTask, forceRefresh } = useTasks(user?.id || '');

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

  // Atualizar dados quando o modo de visualização muda
  useEffect(() => {
    console.log('🔄 Modo de visualização mudou para:', viewMode);
    // Forçar atualização dos dados
    forceRefresh();
  }, [viewMode]);

  // Função para forçar atualização quando tarefa é criada
  const handleTaskCreated = () => {
    console.log('✅ Nova tarefa criada - atualizando lista');
    // Força refresh completo
    forceRefresh();
    setShowTaskForm(false);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
      // Persistir o modo de visualização no localStorage
      localStorage.setItem('taskflow-view-mode', newViewMode);
      // Forçar atualização dos dados quando o modo muda
      console.log('🔄 Modo de visualização alterado para:', newViewMode);
      forceRefresh();
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
        return <KanbanView tasks={tasks} loading={loading} onRefresh={forceRefresh} />;
      case 'calendar':
        return <CalendarView tasks={tasks} loading={loading} />;
      case 'list':
        return <ListView tasks={tasks} loading={loading} />;
      default:
        return <KanbanView tasks={tasks} loading={loading} onRefresh={forceRefresh} />;
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: '#121212', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden', // Evita overflow horizontal
    }}>
      {/* Header Moderno com Filtros */}
      <Box
        sx={{
          py: 1,
          px: { xs: 1, sm: 2 }, // Padding responsivo
          pb: 2,
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
            mb: 1,
          }}
        ></Box>

        {/* Filtros de Visualização Modernos */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Sempre em linha (mobile e desktop)
            alignItems: 'center',
            justifyContent: 'space-between', // Distribui os elementos
            gap: { xs: 1, sm: 3 }, // Gap menor no mobile
            p: { xs: 1, sm: 0.8 }, // Padding responsivo
            backgroundColor: '#2a2a2a',
            borderRadius: 2,
            border: '1px solid #333',
          }}
        >
          {/* Seção esquerda: Modo de Visualização */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                color: '#e0e0e0',
                fontWeight: 500,
                fontSize: '0.775rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: { xs: 'none', sm: 'block' }, // Oculto no mobile, visível no desktop
              }}
            >
              Modo de Visualização
            </Typography>

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
                  px: { xs: 1, sm: 2 }, // Padding responsivo
                  py: 1,
                  minWidth: { xs: 80, sm: 120 }, // Largura mínima responsiva
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Tamanho responsivo
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: colorTheme.id === 'dark-gold' ? '#FFC700' : '#1976d2',
                    color: colorTheme.id === 'dark-gold' ? '#000' : 'white',
                    '&:hover': {
                      backgroundColor: colorTheme.id === 'dark-gold' ? '#E6B300' : '#1565c0',
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
              <ToggleButton
                value="kanban"
                aria-label="kanban"
                sx={{ fontSize: '12px !important' }}
              >
                <ViewKanban sx={{ mr: 1, fontSize: '16px !important' }} />
                Kanban
              </ToggleButton>
              <ToggleButton
                value="calendar"
                aria-label="calendário"
                sx={{ fontSize: '12px !important' }}
              >
                <CalendarMonth sx={{ mr: 1, fontSize: '16px !important' }} />
                Calendário
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Seção direita: Contador de Tarefas */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 1, sm: 2 }, // Padding horizontal responsivo
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
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Fonte menor no mobile
              }}
            >
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </Typography>
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
        onTaskUpdated={handleTaskCreated}
      />
    </Box>
  );
};
