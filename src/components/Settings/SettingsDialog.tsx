import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Add, Delete, Palette } from '@mui/icons-material';
import { useCategories } from '../../hooks/useCategories';
import { useSettings } from '../../hooks/useSettings';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const predefinedColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
];

export const SettingsDialog = ({
  open,
  onClose,
  userId,
}: SettingsDialogProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(predefinedColors[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { categories, createCategory, deleteCategory } = useCategories(userId);
  const { settings, updateTheme, updateDefaultView } = useSettings(userId);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await createCategory(
        newCategoryName.trim(),
        newCategoryColor
      );
      if (error) throw error;

      setNewCategoryName('');
      setNewCategoryColor(predefinedColors[0]);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await deleteCategory(categoryId);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Palette sx={{ mr: 1 }} />
          Configurações
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Configurações Gerais */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Configurações Gerais
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box display="flex" gap={2} flexWrap="wrap">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Tema</InputLabel>
                <Select
                  value={settings?.theme || 'light'}
                  onChange={(e: any) =>
                    updateTheme(e.target.value as 'light' | 'dark')
                  }
                  label="Tema"
                >
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Escuro</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Visualização Padrão</InputLabel>
                <Select
                  value={settings?.default_view || 'kanban'}
                  onChange={(e: any) =>
                    updateDefaultView(e.target.value as 'kanban' | 'calendar')
                  }
                  label="Visualização Padrão"
                >
                  <MenuItem value="kanban">Kanban</MenuItem>
                  <MenuItem value="calendar">Calendário</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Gerenciamento de Categorias */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Categorias
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Nova Categoria */}
            <Box display="flex" gap={2} alignItems="center" mb={3}>
              <TextField
                label="Nome da Categoria"
                value={newCategoryName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCategoryName(e.target.value)
                }
                size="small"
                sx={{ flex: 1 }}
              />

              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="body2">Cor:</Typography>
                <Box display="flex" gap={0.5}>
                  {predefinedColors.slice(0, 8).map(color => (
                    <Box
                      key={color}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: color,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border:
                          newCategoryColor === color
                            ? '2px solid'
                            : '1px solid',
                        borderColor:
                          newCategoryColor === color
                            ? 'primary.main'
                            : 'divider',
                      }}
                      onClick={() => setNewCategoryColor(color)}
                    />
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateCategory}
                disabled={loading || !newCategoryName.trim()}
                size="small"
              >
                {loading ? <CircularProgress size={20} /> : 'Adicionar'}
              </Button>
            </Box>

            {/* Lista de Categorias */}
            <Grid container spacing={1}>
              {categories.map(category => (
                <Grid item key={category.id}>
                  <Chip
                    label={category.name}
                    sx={{
                      bgcolor: category.color,
                      color: 'white',
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                      },
                    }}
                    onDelete={() => handleDeleteCategory(category.id)}
                    deleteIcon={<Delete />}
                  />
                </Grid>
              ))}
            </Grid>

            {categories.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma categoria criada ainda.
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};
