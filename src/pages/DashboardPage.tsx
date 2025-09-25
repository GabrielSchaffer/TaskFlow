import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Pause, PlayArrow, CheckCircle, Close } from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.id || '');
  const [filteredStage, setFilteredStage] = useState<string | null>(null);

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

  const clearFilter = () => {
    setFilteredStage(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Visão geral das suas tarefas e produtividade
      </Typography>

      {/* Alertas para tarefas urgentes */}
      {tasks.filter(
        (task: Task) => task.priority === 'Alta' && task.status !== 'completed'
      ).length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Você tem{' '}
          {
            tasks.filter(
              (task: Task) =>
                task.priority === 'Alta' && task.status !== 'completed'
            ).length
          }{' '}
          tarefa(s) urgente(s) pendente(s)!
        </Alert>
      )}

      {/* Cards de Etapas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
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

      {/* Indicador de Filtro Ativo */}
      {filteredStage && (
        <Box sx={{ mb: 3 }}>
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={clearFilter}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{
              backgroundColor: '#1e3a8a',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white',
              },
            }}
          >
            Mostrando apenas tarefas da etapa:{' '}
            <Box component="strong">
              {filteredStage === 'todo'
                ? 'A Fazer'
                : filteredStage === 'in_progress'
                ? 'Em Andamento'
                : 'Concluídas'}
            </Box>
          </Alert>
        </Box>
      )}

      {/* Lista de Tarefas Filtradas */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
          {filteredStage
            ? `Tarefas - ${
                filteredStage === 'todo'
                  ? 'A Fazer'
                  : filteredStage === 'in_progress'
                  ? 'Em Andamento'
                  : 'Concluídas'
              }`
            : 'Todas as Tarefas'}
        </Typography>

        {filteredTasks.length === 0 ? (
          <Alert
            severity="info"
            sx={{ backgroundColor: '#1e1e1e', color: '#b0b0b0' }}
          >
            {filteredStage
              ? `Nenhuma tarefa encontrada na etapa selecionada.`
              : 'Nenhuma tarefa encontrada.'}
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map((task: Task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card
                  sx={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #333',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', flex: 1 }}>
                        {task.title}
                      </Typography>
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
                          backgroundColor:
                            task.status === 'todo'
                              ? '#f44336'
                              : task.status === 'in_progress'
                              ? '#ff9800'
                              : '#4caf50',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>

                    {task.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#b0b0b0',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.description.length > 100
                          ? `${task.description.substring(0, 100)}...`
                          : task.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor:
                            task.priority === 'Alta'
                              ? '#f44336'
                              : task.priority === 'Média'
                              ? '#ff9800'
                              : '#2196f3',
                          color: 'white',
                        }}
                      />

                      {task.category && (
                        <Chip
                          label={task.category}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: '#b0b0b0',
                            borderColor: '#555',
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
