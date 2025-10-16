import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.id || '');
  const { colorTheme } = useTheme();

  // Contar tarefas por etapa
  const completedTasks = tasks.filter(
    (task: Task) => task.status === 'completed'
  );

  // Estatísticas gerais
  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Tarefas por prioridade
  const highPriorityTasks = tasks.filter(
    (task: Task) => task.priority === 'Alta'
  );

  // Tarefas importantes
  const importantTasks = tasks.filter((task: Task) => task.important);

  // Tarefas vencidas
  const overdueTasks = tasks.filter((task: Task) => {
    const today = new Date();
    const dueDate = new Date(task.due_date);
    return dueDate < today && task.status !== 'completed';
  });

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
    <Box
      sx={{
        minHeight: '100vh',
        background: colorTheme.id === 'dark-gold' 
          ? '#191919' 
          : '#191919',
        p: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
        position: 'relative',
        width: '100%',
        overflow: 'hidden', // Evita overflow horizontal
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colorTheme.id === 'dark-gold'
          ? '#191919' 
          : '#191919',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 800,
            mb: 2,
            background: colorTheme.id === 'dark-gold' 
              ? 'linear-gradient(45deg, #ffffff, #ffffff)'
              : 'linear-gradient(45deg, #ffffff, #e0e0e0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 400,
            mb: 4,
          }}
        >
          Visão geral das suas tarefas e produtividade
        </Typography>

        {/* Alertas elegantes */}
        {highPriorityTasks.filter(task => task.status !== 'completed').length >
          0 && (
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: 3,
              p: 3,
              mb: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography sx={{ color: '#ffc107', fontWeight: 600 }}>
              ⚠️ Você tem{' '}
              {
                highPriorityTasks.filter(task => task.status !== 'completed')
                  .length
              }{' '}
              tarefa(s) de alta prioridade pendente(s)!
            </Typography>
          </Box>
        )}

        {overdueTasks.length > 0 && (
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: 3,
              p: 3,
              mb: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography sx={{ color: '#f44336', fontWeight: 600 }}>
              🚨 Você tem {overdueTasks.length} tarefa(s) vencida(s)!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Progresso Principal - Design Elegante */}
      <Box
        sx={{
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            p: 5,
            backdropFilter: 'blur(20px)',
            boxShadow: colorTheme.id === 'dark-gold' 
              ? 'none'
              : '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #FFC700, #E6B300)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 4,
                background: colorTheme.id === 'dark-gold' 
                  ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                  : 'linear-gradient(135deg, #FFC700 0%, #E6B300 100%)',
                mr: 2,
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
            >
              <TrendingUp sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 0,
                  background: colorTheme.id === 'dark-gold' 
                    ? 'linear-gradient(45deg, #fff, #fff)'
                    : 'linear-gradient(45deg, #FFC700, #E6B300)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Progresso Geral
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.1rem',
                }}
              >
                Acompanhe seu progresso nas tarefas
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                }}
              >
                Tarefas Concluídas
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #FFC700, #E6B300)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {completedTasks.length} de {totalTasks}
              </Typography>
            </Box>

            <Box sx={{ mb: 0 }}>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  mb: 1,
                  '& .MuiLinearProgress-bar': {
                    background: colorTheme.id === 'dark-gold'
                      ? 'linear-gradient(90deg, #FFC700 0%, #E6B300 50%, #D4A017 100%)'
                      : 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    borderRadius: 10,
                    boxShadow: colorTheme.id === 'dark-gold'
                      ? 'none'
                      : '0 4px 20px rgba(102, 126, 234, 0.4)',
                  },
                }}
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  background: colorTheme.id === 'dark-gold' 
                    ? 'linear-gradient(45deg, #FFC700, #E6B300, #D4A017)'
                    : 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0,
                  fontSize: { xs: '3rem', md: '4rem' },
                  textShadow: colorTheme.id === 'dark-gold'
                    ? 'none'
                    : '0 0 30px rgba(102, 126, 234, 0.3)',
                }}
              >
                {completionPercentage}%
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 400,
                }}
              >
                de conclusão
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Cards de Estatísticas - Design Moderno */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }} // Spacing responsivo
        sx={{ mb: 4, position: 'relative', zIndex: 1 }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: colorTheme.id === 'dark-gold'
                ? 'linear-gradient(135deg, rgba(255, 199, 0, 0.1) 0%, rgba(255, 199, 0, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
              border: colorTheme.id === 'dark-gold'
                ? '1px solid rgba(255, 199, 0, 0.2)'
                : '1px solid rgba(244, 67, 54, 0.2)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: colorTheme.id === 'dark-gold'
                ? 'none'
                : '0 15px 35px rgba(244, 67, 54, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 25px 50px rgba(244, 67, 54, 0.3)',
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                background: colorTheme.id === 'dark-gold' 
                  ? 'linear-gradient(135deg, #FFC700 0%, #E6B300 100%)'
                  : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                mb: 3,
                display: 'inline-block',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 10px 30px rgba(244, 67, 54, 0.4)',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {highPriorityTasks.length}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                fontSize: '1.2rem',
              }}
            >
              Alta Prioridade
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
              }}
            >
              Tarefas Importantes
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: colorTheme.id === 'dark-gold'
                ? 'linear-gradient(135deg, rgba(230, 179, 0, 0.1) 0%, rgba(230, 179, 0, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
              border: colorTheme.id === 'dark-gold'
                ? '1px solid rgba(230, 179, 0, 0.2)'
                : '1px solid rgba(255, 152, 0, 0.2)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: colorTheme.id === 'dark-gold'
                ? 'none'
                : '0 15px 35px rgba(255, 152, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 25px 50px rgba(255, 152, 0, 0.3)',
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                background: colorTheme.id === 'dark-gold' 
                  ? 'linear-gradient(135deg, #E6B300 0%, #D4A017 100%)'
                  : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                mb: 3,
                display: 'inline-block',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 10px 30px rgba(255, 152, 0, 0.4)',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {importantTasks.length}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                fontSize: '1.2rem',
              }}
            >
              Importantes
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
              }}
            >
              Tarefas marcadas
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: colorTheme.id === 'dark-gold'
                ? 'linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, rgba(212, 160, 23, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(255, 87, 34, 0.05) 100%)',
              border: colorTheme.id === 'dark-gold'
                ? '1px solid rgba(212, 160, 23, 0.2)'
                : '1px solid rgba(255, 87, 34, 0.2)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: colorTheme.id === 'dark-gold'
                ? 'none'
                : '0 15px 35px rgba(255, 87, 34, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 25px 50px rgba(255, 87, 34, 0.3)',
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                background: colorTheme.id === 'dark-gold' 
                  ? 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)'
                  : 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
                mb: 3,
                display: 'inline-block',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 10px 30px rgba(255, 87, 34, 0.4)',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {overdueTasks.length}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                fontSize: '1.2rem',
              }}
            >
              Vencidas
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
              }}
            >
              Tarefas atrasadas
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: colorTheme.id === 'dark-gold'
                ? 'linear-gradient(135deg, rgba(255, 199, 0, 0.1) 0%, rgba(255, 199, 0, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
              border: colorTheme.id === 'dark-gold'
                ? '1px solid rgba(255, 199, 0, 0.2)'
                : '1px solid rgba(33, 150, 243, 0.2)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: colorTheme.id === 'dark-gold'
                ? 'none'
                : '0 15px 35px rgba(33, 150, 243, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 25px 50px rgba(33, 150, 243, 0.3)',
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                background: colorTheme.id === 'dark-gold' 
                  ? 'linear-gradient(135deg, #FFC700 0%, #E6B300 100%)'
                  : 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                mb: 3,
                display: 'inline-block',
                boxShadow: colorTheme.id === 'dark-gold'
                  ? 'none'
                  : '0 10px 30px rgba(33, 150, 243, 0.4)',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {totalTasks}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                fontSize: '1.2rem',
              }}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
              }}
            >
              Todas as tarefas
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
