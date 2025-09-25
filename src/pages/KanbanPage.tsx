import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { KanbanView } from '../components/Views/KanbanView';

export const KanbanPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.id || '');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kanban
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Organize suas tarefas arrastando entre as colunas
      </Typography>

      <KanbanView tasks={tasks} loading={loading} />
    </Box>
  );
};
