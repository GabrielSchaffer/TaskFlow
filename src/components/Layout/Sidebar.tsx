import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Button,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Today,
  Star,
  Settings,
  Add,
  Logout,
  NewReleases,
  Close,
  CheckCircle,
  AutoAwesome,
  Speed,
  Palette,
  Campaign,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  onNewTask: () => void;
}

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
  },
  {
    text: 'Tarefas',
    icon: <Assignment />,
    path: '/tasks',
  },
  {
    text: 'Meu Dia',
    icon: <Today />,
    path: '/my-day',
  },
  {
    text: 'Importante',
    icon: <Star />,
    path: '/important',
  },
];

export const Sidebar = ({ onNewTask }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id || '');
  const { colorTheme } = useTheme();
  const [showNewsModal, setShowNewsModal] = useState(false);

  // Número de novidades (pode ser controlado por localStorage ou API)
  const totalNewsCount = 6;

  // Verificar se as novidades foram lidas
  const [newsRead, setNewsRead] = useState(() => {
    const readStatus = localStorage.getItem('taskflow-news-read');
    return readStatus === 'true';
  });

  // Contador de novidades não lidas - só mostra se não foram lidas
  const newsCount = newsRead ? 0 : totalNewsCount;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMarkNewsAsRead = () => {
    setNewsRead(true);
    localStorage.setItem('taskflow-news-read', 'true');
  };

  const handleResetNews = () => {
    setNewsRead(false);
    localStorage.removeItem('taskflow-news-read');
    // Força re-render para atualizar o badge
    setTimeout(() => {
      setNewsRead(false);
    }, 100);

    // Feedback visual
    console.log('Novidades resetadas! Badge deve aparecer novamente.');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: colorTheme.sidebarGradient,
          color: 'white',
          border: 'none',
        },
      }}
    >
      <Box sx={{ p: 1 }}>
        <Box
          component="img"
          src="/logonova.webp"
          alt="TaskFlow"
          sx={{
            width: '80%',
            height: '80%',
            margin: '0 auto',
            display: 'block',
            borderRadius: 2,
            padding: 1,
            marginBottom: 2,
            // backgroundColor: 'rgba(0,0,0,0.1)',
            // boxShadow: '0 4px 12px rgba(255,255,255,0.2)',
            transition: 'all 0.2s ease',
          }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map(item => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor:
                  location.pathname === item.path
                    ? 'rgba(255,255,255,0.2)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight:
                    location.pathname === item.path ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Botão Nova Tarefa no topo */}
      <Box sx={{ px: 2, py: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={onNewTask}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: colorTheme.buttonGradient,
            '&:hover': {
              background: colorTheme.buttonGradient,
              filter: 'brightness(0.9)',
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 12px ${colorTheme.primary}40`,
            },
            transition: 'all 0.2s ease',
          }}
        >
          Nova Tarefa
        </Button>
      </Box>

      <Box sx={{ px: 2, py: 2, mt: 'auto' }}>
        {/* Perfil do Usuário */}
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar
              src={profile?.avatar_url}
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
              }}
            >
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile?.full_name || 'Usuário'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {profile?.email || user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Botões de Novidades, Configurações e Sair */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Botão de Novidades */}
          <ListItemButton
            onClick={() => setShowNewsModal(true)}
            sx={{
              flex: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'white',
                minWidth: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {newsCount > 0 ? (
                <Badge
                  badgeContent={newsCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.7rem',
                      height: '18px',
                      minWidth: '18px',
                    },
                  }}
                >
                  <Campaign />
                </Badge>
              ) : (
                <Campaign />
              )}
            </ListItemIcon>
          </ListItemButton>

          {/* Botão de Configurações */}
          <ListItemButton
            onClick={() => navigate('/settings')}
            sx={{
              flex: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'white',
                minWidth: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Settings />
            </ListItemIcon>
          </ListItemButton>

          {/* Botão de Sair */}
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              flex: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'white',
                minWidth: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Logout />
            </ListItemIcon>
          </ListItemButton>
        </Box>
      </Box>

      {/* Modal de Novidades */}
      <Dialog
        open={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: 'white',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #333',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: '#ff9800' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Novidades do TaskFlow
            </Typography>
          </Box>
          <IconButton
            onClick={() => setShowNewsModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Novidade 1: Kanban Board no Meu Dia */}
            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Speed sx={{ color: '#4caf50', fontSize: '2rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Kanban Board no Meu Dia
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label="Nova Funcionalidade"
                        size="small"
                        sx={{ backgroundColor: '#4caf50', color: 'white' }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#888', fontSize: '0.75rem' }}
                      >
                        📅 15 de Janeiro, 2025
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Agora você pode organizar suas tarefas do dia usando um
                  sistema de colunas drag-and-drop:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • <strong>Pendentes:</strong> Tarefas não iniciadas
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • <strong>Em Andamento:</strong> Tarefas sendo trabalhadas
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • <strong>Concluídas:</strong> Tarefas finalizadas
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Novidade 2: Cards de Estatísticas Elegantes */}
            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Palette sx={{ color: '#ff9800', fontSize: '2rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Design Renovado
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label="Melhoria Visual"
                        size="small"
                        sx={{ backgroundColor: '#ff9800', color: 'white' }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#888', fontSize: '0.75rem' }}
                      >
                        📅 14 de Janeiro, 2025
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Cards de estatísticas com gradientes elegantes e animações
                  suaves:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Gradientes coloridos para cada tipo de estatística
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Animações hover com elevação e sombras
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Ícones significativos para cada categoria
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Novidade 3: Tarefas Importantes Destacadas */}
            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Star sx={{ color: '#ff9800', fontSize: '2rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Tarefas Importantes em Destaque
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label="Melhoria UX"
                        size="small"
                        sx={{ backgroundColor: '#ff9800', color: 'white' }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#888', fontSize: '0.75rem' }}
                      >
                        📅 13 de Janeiro, 2025
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Nova seção dedicada para tarefas importantes com design
                  especial:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Bordas douradas e estrelas brilhantes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Chips especiais com gradientes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Animações e efeitos visuais únicos
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Novidade 4: Checkbox para Concluir Tarefas */}
            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <CheckCircle sx={{ color: '#4caf50', fontSize: '2rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Marcação Rápida de Tarefas
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label="Produtividade"
                        size="small"
                        sx={{ backgroundColor: '#4caf50', color: 'white' }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#888', fontSize: '0.75rem' }}
                      >
                        📅 12 de Janeiro, 2025
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Agora você pode marcar tarefas como concluídas de forma mais
                  rápida:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Checkbox no canto superior direito
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Botão "Marcar como Concluída" no card
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Auto-movimentação para coluna de concluídas
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Novidade 5: Sistema de Notificações */}
            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Campaign sx={{ color: '#2196f3', fontSize: '2rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Sistema de Novidades
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label="Nova Funcionalidade"
                        size="small"
                        sx={{ backgroundColor: '#2196f3', color: 'white' }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#888', fontSize: '0.75rem' }}
                      >
                        📅 11 de Janeiro, 2025
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Fique sempre atualizado com as últimas melhorias:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Badge de notificação no menu lateral
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Modal com todas as novidades
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Contador de atualizações
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Novidade 6: Layout Simplificado de Tarefas Importantes */}
            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Star sx={{ color: '#ff9800', fontSize: '2rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Layout Simplificado
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label="Melhoria UX"
                        size="small"
                        sx={{ backgroundColor: '#ff9800', color: 'white' }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#888', fontSize: '0.75rem' }}
                      >
                        📅 16 de Janeiro, 2025
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Página de tarefas importantes com layout otimizado e foco
                  total:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Cards de estatísticas removidos para mais foco
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Layout Kanban de coluna única ocupando toda a largura
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Interface mais limpa e direta
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    • Melhor experiência de usuário
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
          <Button
            onClick={() => {
              handleMarkNewsAsRead();
              setShowNewsModal(false);
            }}
            variant="contained"
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Marcar como lidas!
          </Button>

          {/* Botão de reset para desenvolvimento (opcional) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <Button
              onClick={() => {
                handleResetNews();
                // Fecha o modal após reset
                setShowNewsModal(false);
              }}
              variant="outlined"
              sx={{
                color: '#ff9800',
                borderColor: '#ff9800',
                '&:hover': {
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  borderColor: '#ff9800',
                },
              }}
            >
              Reset Novidades
            </Button>
          )} */}
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};
