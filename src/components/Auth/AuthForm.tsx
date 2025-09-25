import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        // Cadastro
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Conta criada com sucesso! Você já pode fazer login.');
          // Limpar campos após cadastro bem-sucedido
          setEmail('');
          setPassword('');
          // Trocar para login após 2 segundos
          setTimeout(() => {
            setIsLogin(true);
            setSuccess(null);
          }, 2000);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #301057FF 40%, #070739FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #536CDDFF 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Box
              component="img"
              src="/logonova.webp"
              alt="TaskFlow"
              sx={{
                width: '50%',
                height: '50%',
                margin: '0 auto',
                display: 'block',
                borderRadius: 2,
                padding: 1,
                marginBottom: 0,
                // backgroundColor: 'rgba(0,0,0,0.1)',
                // boxShadow: '0 4px 12px rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease',
              }}
            />

            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0 }}>
              {isLogin
                ? 'Entre na sua conta para gerenciar suas tarefas'
                : 'Cadastre-se para começar a gerenciar suas tarefas'}
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              margin="normal"
              required
              autoComplete="email"
              placeholder="Insira seu email cadastrado"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  color: '#000000',

                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    color: '#000000',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    color: '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#263238',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#263238',
                },
              }}
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Insira sua senha de acesso"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              margin="normal"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    color: '#000000',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    color: '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#263238',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#263238',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={isLogin ? <Login /> : <PersonAdd />}
              sx={{
                mt: 4,
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Cadastrar'
              )}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleToggleMode}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5a6fd8',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                },
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {isLogin
                ? 'Não tem conta? Cadastre-se'
                : 'Já tem conta? Entre aqui'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
