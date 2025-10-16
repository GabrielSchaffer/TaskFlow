import React, { useState } from 'react';
import { Box, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { TaskForm } from '../Tasks/TaskForm';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { colorTheme } = useTheme();

  const handleNewTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskUpdated = () => {
    // Forçar atualização da página para mostrar a nova tarefa
    window.location.reload();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar para mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 280px)` },
          ml: { sm: `280px` },
          display: { xs: 'block', sm: 'none' }, // Apenas em mobile
          backgroundColor: colorTheme.sidebarGradient,
          borderBottom: '1px solid #333',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ 
            color: 'white',
            fontWeight: 'bold'
          }}>
            TaskFlow - Gerenciador de Tarefas
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar 
        onNewTask={handleNewTask} 
        open={mobileOpen}
        onClose={handleDrawerClose}
      />

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: { xs: '100%', sm: 'calc(100% - 280px)' }, // Largura total em mobile, menos sidebar em desktop
        ml: { xs: 0, sm: 0 }, // Sem margin em mobile
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}>
        {/* Spacer para AppBar em mobile */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, height: '64px' }} />
        
        {/* Page Content */}
        <Box component="main" sx={{ 
          flexGrow: 1,
          width: '100%',
          overflow: 'hidden', // Evita overflow horizontal
        }}>
          {children}
        </Box>
      </Box>

      {/* Task Form Modal */}
      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        userId={user?.id || ''}
        onTaskUpdated={handleTaskUpdated}
        initialData={{
          title: '',
          description: '',
          due_date: new Date().toISOString(),
          priority: 'Média' as const,
          category: '',
          important: false,
          status: 'todo' as const,
        }}
      />
    </Box>
  );
};
