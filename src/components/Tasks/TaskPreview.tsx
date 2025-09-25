import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close,
  Edit,
  Star,
  Schedule,
  Flag,
  Category,
  CheckCircle,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { Task } from '../../types';
import dayjs from 'dayjs';

interface TaskPreviewProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
}

const priorityColors = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#2196f3',
} as const;

const statusColors = {
  todo: '#f44336',
  in_progress: '#ff9800',
  completed: '#4caf50',
} as const;

const statusIcons = {
  todo: <Pause />,
  in_progress: <PlayArrow />,
  completed: <CheckCircle />,
};

const statusLabels = {
  todo: 'A Fazer',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
};

export const TaskPreview = ({
  open,
  onClose,
  task,
  onEdit,
}: TaskPreviewProps) => {
  if (!task) return null;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY [às] HH:mm');
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#666';
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || '#666';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          borderBottom: '1px solid #333',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {task.important && (
            <Star sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
          )}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {task.title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: '#b0b0b0', '&:hover': { color: 'white' } }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Informações Principais */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 1 }}>
                Descrição:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  backgroundColor: '#2a2a2a',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid #333',
                  minHeight: '80px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {task.description || 'Sem descrição'}
              </Typography>
            </Box>
          </Grid>

          {/* Status e Prioridade */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 1 }}>
                Status:
              </Typography>
              <Chip
                icon={statusIcons[task.status as keyof typeof statusIcons]}
                label={statusLabels[task.status as keyof typeof statusLabels]}
                sx={{
                  backgroundColor: getStatusColor(task.status),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 1 }}>
                Prioridade:
              </Typography>
              <Chip
                icon={<Flag />}
                label={task.priority}
                sx={{
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Grid>

          {/* Data de Vencimento */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 1 }}>
                Data de Vencimento:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ color: '#b0b0b0', fontSize: '1.2rem' }} />
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {formatDate(task.due_date)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Categoria */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 1 }}>
                Categoria:
              </Typography>
              {task.category ? (
                <Chip
                  icon={<Category />}
                  label={task.category}
                  variant="outlined"
                  sx={{
                    color: '#b0b0b0',
                    borderColor: '#555',
                    '&:hover': {
                      borderColor: '#777',
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: '#666', fontStyle: 'italic' }}
                >
                  Sem categoria
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Informações Adicionais */}
          <Grid item xs={12}>
            <Divider sx={{ borderColor: '#333', my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Criada em:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {formatDate(task.created_at)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Última atualização:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {formatDate(task.updated_at)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#b0b0b0',
            '&:hover': {
              backgroundColor: '#333',
              color: 'white',
            },
          }}
        >
          Fechar
        </Button>
        <Button
          onClick={onEdit}
          variant="contained"
          startIcon={<Edit />}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Editar Tarefa
        </Button>
      </DialogActions>
    </Dialog>
  );
};
