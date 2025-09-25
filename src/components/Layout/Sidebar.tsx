import React from 'react';
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
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Today,
  Star,
  Settings,
  Add,
  Logout,
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
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
          src="/newlogo.webp"
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

        {/* Botões de Configurações e Sair */}
        <Box sx={{ display: 'flex', gap: 1 }}>
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
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
          </ListItemButton>

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
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};
