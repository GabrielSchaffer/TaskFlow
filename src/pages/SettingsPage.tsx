import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Palette,
  Settings,
  CheckCircle,
  Gradient,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  colorThemes,
} from '../constants/colorThemes';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    settings,
    updateTheme,
    updateDefaultView,
    updateColorTheme,
    loading,
  } = useSettings(user?.id || '');
  const { colorTheme, setColorTheme } = useTheme();
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>(
    settings?.color_theme || colorTheme.id || 'blue-purple'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Sincronizar tema quando as configurações carregarem
  useEffect(() => {
    if (settings?.color_theme && settings.color_theme !== selectedColorTheme) {
      setSelectedColorTheme(settings.color_theme);
      setColorTheme(settings.color_theme);
    }
  }, [settings?.color_theme, setColorTheme, selectedColorTheme]);

  const handleColorThemeChange = async (themeId: string) => {
    setSelectedColorTheme(themeId);
    setColorTheme(themeId); // Aplicar tema imediatamente
    await updateColorTheme(themeId); // Salvar no banco
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ backgroundColor: '#121212' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            mb: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Configurações
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#b0b0b0',
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          Personalize sua experiência no TaskFlow
        </Typography>
      </Box>

      {/* Success Alert */}
      {showSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            backgroundColor: '#1e1e1e',
            color: '#4caf50',
            border: '1px solid #4caf50',
          }}
        >
          Tema de cores atualizado com sucesso!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Perfil do Usuário */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#1e1e1e',
              border: '1px solid #333',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <CardContent
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Avatar
                  sx={{
                    backgroundColor: '#1976d2',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Perfil do Usuário
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Gerencie suas informações pessoais
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#b0b0b0',
                  mb: 3,
                  flex: 1,
                  lineHeight: 1.6,
                }}
              >
                Gerencie suas informações pessoais, foto de perfil e dados de
                contato. Personalize como você aparece no sistema.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Person />}
                onClick={() => navigate('/profile')}
                sx={{
                  background: colorTheme.buttonGradient,
                  '&:hover': {
                    background: colorTheme.buttonGradient,
                    filter: 'brightness(0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 16px ${colorTheme.primary}40`,
                  },
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Gerenciar Perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Configurações Gerais */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#1e1e1e',
              border: '1px solid #333',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <CardContent
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Avatar
                  sx={{
                    backgroundColor: '#ff9800',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Settings />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Configurações Gerais
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Personalize tema e visualização
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  flex: 1,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#e0e0e0' }}>Tema</InputLabel>
                  <Select
                    value={settings?.theme || 'dark'}
                    onChange={(e: any) =>
                      updateTheme(e.target.value as 'light' | 'dark')
                    }
                    label="Tema"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    }}
                  >
                    <MenuItem value="light">Claro</MenuItem>
                    <MenuItem value="dark">Escuro</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#e0e0e0' }}>
                    Visualização Padrão
                  </InputLabel>
                  <Select
                    value={settings?.default_view || 'kanban'}
                    onChange={(e: any) =>
                      updateDefaultView(e.target.value as 'kanban' | 'calendar')
                    }
                    label="Visualização Padrão"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    }}
                  >
                    <MenuItem value="kanban">Kanban</MenuItem>
                    <MenuItem value="calendar">Calendário</MenuItem>
                    <MenuItem value="list">Lista</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tema de Cores */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #333',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}
              >
                <Avatar
                  sx={{
                    backgroundColor: '#9c27b0',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Palette />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Tema de Cores
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Escolha as cores que mais combinam com você
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {colorThemes.map(theme => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
                    <Paper
                      onClick={() => handleColorThemeChange(theme.id)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border:
                          selectedColorTheme === theme.id
                            ? '2px solid #1976d2'
                            : '1px solid #333',
                        backgroundColor: '#2a2a2a',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#333',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                        position: 'relative',
                      }}
                    >
                      {selectedColorTheme === theme.id && (
                        <CheckCircle
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#4caf50',
                            fontSize: '1.5rem',
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          height: 60,
                          background: theme.gradient,
                          borderRadius: 1,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Gradient sx={{ color: 'white', fontSize: '2rem' }} />
                      </Box>

                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'white', fontWeight: 600, mb: 1 }}
                      >
                        {theme.name}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: theme.primary,
                            borderRadius: '50%',
                          }}
                        />
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: theme.secondary,
                            borderRadius: '50%',
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
