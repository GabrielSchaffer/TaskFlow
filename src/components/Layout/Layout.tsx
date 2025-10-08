import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { TaskForm } from '../Tasks/TaskForm';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user } = useAuth();

  const handleNewTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskUpdated = () => {
    // Forçar atualização da página para mostrar a nova tarefa
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar onNewTask={handleNewTask} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
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
