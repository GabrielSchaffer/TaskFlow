import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { CalendarView } from '../components/Views/CalendarView';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.id || '');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Calendário
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Visualize suas tarefas organizadas por data
      </Typography>

      <CalendarView tasks={tasks} loading={loading} />
    </Box>
  );
};
