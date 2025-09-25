import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Save, Edit } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile(
    user?.id || ''
  );

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    profession: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        profession: profile.profession || '',
      });
    }
  }, [profile, user]);

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await updateProfile(formData);
      if (error) throw error;

      setSuccess('Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setError(null);

    try {
      const { url, error } = await uploadAvatar(file);
      if (error) throw error;

      if (url) {
        await updateProfile({ avatar_url: url });
      }
      setSuccess('Foto de perfil atualizada com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da foto');
    } finally {
      setSaving(false);
    }
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Perfil do Usuário
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gerencie suas informações pessoais
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Foto de Perfil */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Foto de Perfil
              </Typography>

              <Box
                sx={{ position: 'relative', display: 'inline-block', mb: 2 }}
              >
                <Avatar
                  src={profile?.avatar_url}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '3rem',
                  }}
                >
                  {profile?.full_name?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    'U'}
                </Avatar>

                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'background.paper',
                    },
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarUpload}
                  />
                  <PhotoCamera />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Clique no ícone da câmera para alterar sua foto
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações do Perfil */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6">Informações Pessoais</Typography>
                <Button
                  variant={editing ? 'outlined' : 'contained'}
                  startIcon={editing ? <Save /> : <Edit />}
                  onClick={editing ? handleSave : () => setEditing(true)}
                  disabled={saving}
                >
                  {saving ? (
                    <CircularProgress size={20} />
                  ) : editing ? (
                    'Salvar'
                  ) : (
                    'Editar'
                  )}
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    value={formData.full_name}
                    onChange={handleChange('full_name')}
                    disabled={!editing}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    disabled={!editing}
                    variant="outlined"
                    type="email"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    disabled={!editing}
                    variant="outlined"
                    placeholder="(11) 99999-9999"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Profissão"
                    value={formData.profession}
                    onChange={handleChange('profession')}
                    disabled={!editing}
                    variant="outlined"
                    placeholder="Ex: Desenvolvedor, Designer, etc."
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        full_name: profile?.full_name || '',
                        email: profile?.email || user?.email || '',
                        phone: profile?.phone || '',
                        profession: profile?.profession || '',
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    startIcon={
                      saving ? <CircularProgress size={20} /> : <Save />
                    }
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
