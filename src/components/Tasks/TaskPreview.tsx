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
      fullScreen={window.innerWidth < 600}
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          border: 'none',
          borderRadius: { xs: 0, sm: 3 },
          margin: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '90vh' },
          boxShadow: {
            xs: 'none',
            sm: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
          overflow: 'hidden',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          borderBottom: '1px solid #2a2a2a',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, #444 50%, transparent 100%)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
           <Typography
            variant="body2"
            sx={{
              color: '#b0b0b0',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              opacity: 0.8,
            
              
            }}
          >
            Título da Tarefa:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
           
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.4rem' },
                lineHeight: 1.2,
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              {task.title}
            </Typography>
          </Box>
         
        </Box>
        {task.important && (
              <Star
                sx={{
                  color: '#ff9800',
                  fontSize: { xs: '1.4rem', sm: '1.2rem' },
                  filter: 'drop-shadow(0 0 4px rgba(255, 152, 0, 0.3))',
                }}
              />
            )}
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 4 },
          overflow: 'auto',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #1e1e1e 100%)',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2a2a2a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#555',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#777',
          },
        }}
      >
        {/* Layout Mobile Otimizado */}
        {window.innerWidth < 600 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header com Status, Prioridade e Categoria */}
            <Box sx={{ mb: 2, my: 3 }}>
             
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ flex: 1, minWidth: '80px' }}>
                  <Typography
                    sx={{
                      color: '#b0b0b0',
                      fontSize: '0.7rem',
                      mb: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    Status:
                  </Typography>
                  <Chip
                    icon={statusIcons[task.status as keyof typeof statusIcons]}
                    label={
                      statusLabels[task.status as keyof typeof statusLabels]
                    }
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(task.status),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: '28px',
                      width: '100%',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '80px' }}>
                  <Typography
                    sx={{
                      color: '#b0b0b0',
                      fontSize: '0.7rem',
                      mb: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    Prioridade:
                  </Typography>
                  <Chip
                    icon={<Flag />}
                    label={task.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: '28px',
                      width: '100%',
                    }}
                  />
                </Box>
                {task.category && (
                  <Box sx={{ flex: 1, minWidth: '80px' }}>
                    <Typography
                      sx={{
                        color: '#b0b0b0',
                        fontSize: '0.7rem',
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      Categoria:
                    </Typography>
                    <Chip
                      icon={<Category />}
                      label={task.category}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: '#64b5f6',
                        borderColor: '#64b5f6',
                        fontSize: '0.75rem',
                        height: '28px',
                        width: '100%',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Descrição */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#b0b0b0',
                  mb: 1,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                📝 Descrição
              </Typography>
              <Box
                sx={{
                  color: 'white',
                  backgroundColor: '#2a2a2a',
                  p: 2,
                  borderRadius: 1.5,
                  border: '1px solid #3a3a3a',
                  minHeight: '80px',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: 'white',
                    margin: '4px 0',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& p': {
                    color: 'white',
                    margin: '4px 0',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& strong, & b': {
                    fontWeight: 'bold',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& em, & i': {
                    fontStyle: 'italic',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& u': {
                    textDecoration: 'underline',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& s, & strike': {
                    textDecoration: 'line-through',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& a': {
                    color: '#64b5f6',
                    textDecoration: 'underline',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    '&:hover': {
                      color: '#90caf9',
                    },
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #555',
                    paddingLeft: '16px',
                    margin: '8px 0',
                    color: '#ccc',
                    fontStyle: 'italic',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& code': {
                    backgroundColor: '#1a1a1a',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    fontFamily: 'monospace',
                    color: '#ffeb3b',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  },
                  '& ul, & ol': {
                    paddingLeft: '20px',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& li': {
                    color: 'white',
                    margin: '2px 0',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    task.description ||
                    '<p style="color: #666; font-style: italic;">Sem descrição</p>',
                }}
              />
            </Box>

            {/* Informações de Criação e Atualização */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 1.5,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 1.5,
                  border: '1px solid #3a3a3a',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.7rem',
                    mb: 0.5,
                    fontWeight: 600,
                  }}
                >
                  🚀 Data de Início
                </Typography>
                <Typography
                  sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}
                >
                  {formatDate(task.created_at)}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 1.5,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 1.5,
                  border: '1px solid #3a3a3a',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.7rem',
                    mb: 0.5,
                    fontWeight: 600,
                  }}
                >
                  📅 Data de Vencimento
                </Typography>
                <Typography
                  sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}
                >
                  {formatDate(task.due_date)}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          /* Layout Desktop Otimizado */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header com Status, Prioridade e Categoria */}
            <Box sx={{ mb: 0, my: 3 }}>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ flex: 1, minWidth: '120px' }}>
                  <Typography
                    sx={{
                      color: '#b0b0b0',
                      fontSize: '0.9rem',
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    Status
                  </Typography>
                  <Chip
                    icon={statusIcons[task.status as keyof typeof statusIcons]}
                    label={
                      statusLabels[task.status as keyof typeof statusLabels]
                    }
                    size="medium"
                    sx={{
                      backgroundColor: getStatusColor(task.status),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      height: '36px',
                      px: 2,
                      width: '100%',
                      boxShadow: `0 2px 8px ${getStatusColor(task.status)}40`,
                      
                      transition: 'all 0.2s ease',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '120px' }}>
                  <Typography
                    sx={{
                      color: '#b0b0b0',
                      fontSize: '0.9rem',
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    Prioridade
                  </Typography>
                  <Chip
                    icon={<Flag />}
                    label={task.priority}
                    size="medium"
                    sx={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      height: '36px',
                      px: 2,
                      width: '100%',
                      boxShadow: `0 2px 8px ${getPriorityColor(
                        task.priority
                      )}40`,
                     
                      transition: 'all 0.2s ease',
                    }}
                  />
                </Box>
                {task.category && (
                  <Box sx={{ flex: 1, minWidth: '120px' }}>
                    <Typography
                      sx={{
                        color: '#b0b0b0',
                        fontSize: '0.9rem',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Categoria
                    </Typography>
                    <Chip
                      icon={<Category />}
                      label={task.category}
                      variant="outlined"
                      size="medium"
                      sx={{
                        color: '#64b5f6',
                        borderColor: '#64b5f6',
                        fontSize: '1rem',
                        height: '36px',
                        px: 2,
                        width: '100%',
                        fontWeight: 600,
                        
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Descrição */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#e0e0e0',
                  mb: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                📝 Descrição
              </Typography>
              <Box
                sx={{
                  color: 'white',
                  backgroundColor: '#2a2a2a',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #3a3a3a',
                  minHeight: '120px',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: 'white',
                    margin: '8px 0',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& p': {
                    color: 'white',
                    margin: '4px 0',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& strong, & b': {
                    fontWeight: 'bold',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& em, & i': {
                    fontStyle: 'italic',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& u': {
                    textDecoration: 'underline',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& s, & strike': {
                    textDecoration: 'line-through',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& a': {
                    color: '#64b5f6',
                    textDecoration: 'underline',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    '&:hover': {
                      color: '#90caf9',
                    },
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #555',
                    paddingLeft: '16px',
                    margin: '8px 0',
                    color: '#ccc',
                    fontStyle: 'italic',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& code': {
                    backgroundColor: '#1a1a1a',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    fontFamily: 'monospace',
                    color: '#ffeb3b',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  },
                  '& ul, & ol': {
                    paddingLeft: '20px',
                    color: 'white',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                  '& li': {
                    color: 'white',
                    margin: '2px 0',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    task.description ||
                    '<p style="color: #666; font-style: italic;">Sem descrição</p>',
                }}
              />
            </Box>

            

            {/* Informações de Criação e Atualização */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 2.5,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 2,
                  border: '1px solid #3a3a3a',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.9rem',
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  🚀 Data de Início
                </Typography>
                <Typography
                  sx={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}
                >
                  {formatDate(task.created_at)}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 2.5,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 2,
                  border: '1px solid #3a3a3a',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.9rem',
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  📅 Data de Vencimento
                </Typography>
                <Typography
                  sx={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}
                >
                  {formatDate(task.due_date)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 3, sm: 4 },
          borderTop: '1px solid #3a3a3a',
          flexDirection: 'row',
          gap: { xs: 1.5, sm: 2 },
          background: 'linear-gradient(180deg, #1e1e1e 0%, #2a2a2a 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, #555 50%, transparent 100%)',
          },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#b0b0b0',
            borderColor: '#555',
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            fontWeight: 600,
            py: { xs: 1.5, sm: 1.5 },
            px: { xs: 2, sm: 2 },
            borderRadius: 2,
            textTransform: 'none',
            flex: 1,
            '&:hover': {
              backgroundColor: '#333',
              color: 'white',
              borderColor: '#777',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          ✕ Fechar
        </Button>
        <Button
          onClick={onEdit}
          variant="contained"
          startIcon={<Edit />}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            fontWeight: 700,
            py: { xs: 1.5, sm: 1.5 },
            px: { xs: 2, sm: 2 },
            borderRadius: 2,
            textTransform: 'none',
            flex: 1,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          ✏️ Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
