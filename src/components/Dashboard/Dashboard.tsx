import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import {
  ViewKanban,
  CalendarMonth,
  Settings,
  Logout,
  Add,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useSettings } from '../../hooks/useSettings';
import { ViewMode } from '../../types';
import { TaskForm } from '../Tasks/TaskForm';
import { KanbanView } from '../Views/KanbanView';
import { CalendarView } from '../Views/CalendarView';
import { SettingsDialog } from '../Settings/SettingsDialog';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(user?.id || '');
  const { settings, updateTheme, updateDefaultView } = useSettings(
    user?.id || ''
  );

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (settings?.default_view) {
      setViewMode(settings.default_view);
    }
  }, [settings]);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewMode
  ) => {
    if (newView !== null) {
      setViewMode(newView);
      updateDefaultView(newView);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = settings?.theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.due_date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const urgentTasks = todayTasks.filter(
    task => task.priority === 'Alta' && task.status !== 'completed'
  );
  const completedToday = todayTasks.filter(
    task => task.status === 'completed'
  ).length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaskFlow
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="kanban">
              <ViewKanban sx={{ mr: 1 }} />
              Kanban
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarMonth sx={{ mr: 1 }} />
              Calendário
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControlLabel
            control={
              <Switch
                checked={settings?.theme === 'dark'}
                onChange={handleThemeToggle}
                icon={<Brightness7 />}
                checkedIcon={<Brightness4 />}
              />
            }
            label=""
            sx={{ mr: 1 }}
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowTaskForm(true)}
            sx={{ mr: 1 }}
          >
            Nova Tarefa
          </Button>

          <IconButton
            color="inherit"
            onClick={() => setShowSettings(true)}
            sx={{ mr: 1 }}
          >
            <Settings />
          </IconButton>

          <IconButton color="inherit" onClick={handleSignOut}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Resumo do dia */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Tarefas Hoje
                </Typography>
                <Typography variant="h4">{todayTasks.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Urgentes
                </Typography>
                <Typography variant="h4" color="error">
                  {urgentTasks.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Concluídas
                </Typography>
                <Typography variant="h4" color="success.main">
                  {completedToday}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Progresso
                </Typography>
                <Typography variant="h4">
                  {todayTasks.length > 0
                    ? Math.round((completedToday / todayTasks.length) * 100)
                    : 0}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertas para tarefas urgentes */}
        {urgentTasks.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Você tem {urgentTasks.length} tarefa(s) urgente(s) pendente(s) para
            hoje!
          </Alert>
        )}

        {/* Visualização das tarefas */}
        {viewMode === 'kanban' ? (
          <KanbanView tasks={tasks} loading={tasksLoading} />
        ) : (
          <CalendarView tasks={tasks} loading={tasksLoading} />
        )}
      </Box>

      {/* Modal de nova tarefa */}
      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        userId={user?.id || ''}
      />

      {/* Modal de configurações */}
      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        userId={user?.id || ''}
      />
    </Box>
  );
};
