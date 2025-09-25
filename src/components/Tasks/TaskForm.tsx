import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { useTasks } from '../../hooks/useTasks';
import { useCategories } from '../../hooks/useCategories';
import { TaskFormData, Priority } from '../../types';
import { Add } from '@mui/icons-material';

dayjs.locale('pt-br');

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  taskId?: string;
  initialData?: TaskFormData;
  onTaskUpdated?: () => void;
}

export const TaskForm = ({
  open,
  onClose,
  userId,
  taskId,
  initialData,
  onTaskUpdated,
}: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: dayjs().add(1, 'day').toISOString(),
    priority: 'Média',
    category: '',
    important: false,
    status: 'todo',
  });
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#2196f3');

  const { createTask, updateTask } = useTasks(userId);
  const { categories, createCategory, fetchCategories } = useCategories(userId);

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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: dayjs().add(1, 'day').toISOString(),
        priority: 'Média',
        category: '',
        important: false,
        status: 'todo',
      });
    }
  }, [initialData, open]);

  const handleChange =
    (field: keyof TaskFormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | React.ChangeEvent<{ value: unknown }>
    ) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        due_date: date.toISOString(),
      }));
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    setFormData(prev => ({
      ...prev,
      priority,
    }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { error } = await createCategory(
        newCategoryName.trim(),
        newCategoryColor
      );
      if (error) throw error;

      // Definir a categoria imediatamente após criação
      setFormData(prev => ({
        ...prev,
        category: newCategoryName.trim(),
      }));

      setNewCategoryName('');
      setNewCategoryColor('#2196f3');
      setShowNewCategory(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar categoria');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (taskId) {
        const { error } = await updateTask(taskId, formData);
        if (error) throw error;
      } else {
        const { error } = await createTask(formData);
        if (error) throw error;
      }

      // Notificar que a tarefa foi atualizada
      if (onTaskUpdated) {
        onTaskUpdated();
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      title: '',
      description: '',
      due_date: dayjs().add(1, 'day').toISOString(),
      priority: 'Média',
      category: '',
      important: false,
      status: 'todo',
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {taskId ? 'Editar Tarefa' : 'Nova Tarefa'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Título */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Tarefa"
                value={formData.title}
                onChange={handleChange('title')}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Datas */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DateTimePicker
                  label="Data de Início"
                  value={startDate}
                  onChange={(date: Dayjs | null) =>
                    setStartDate(date || dayjs())
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DateTimePicker
                  label="Data de Vencimento"
                  value={dayjs(formData.due_date)}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      required: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Prioridade e Categoria */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e: any) =>
                    handlePriorityChange(e.target.value as Priority)
                  }
                  label="Prioridade"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'info.main',
                          borderRadius: '50%',
                        }}
                      />
                      Baixa
                    </Box>
                  </MenuItem>
                  <MenuItem value="Média">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'warning.main',
                          borderRadius: '50%',
                        }}
                      />
                      Média
                    </Box>
                  </MenuItem>
                  <MenuItem value="Alta">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'error.main',
                          borderRadius: '50%',
                        }}
                      />
                      Alta
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e: any) =>
                    setFormData(prev => ({
                      ...prev,
                      category: e.target.value as string,
                    }))
                  }
                  onOpen={() => {
                    // Recarrega as categorias quando o usuário abre o dropdown
                    fetchCategories();
                  }}
                  label="Categoria"
                  sx={{ borderRadius: 2 }}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.name}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            bgcolor: category.color,
                            borderRadius: '50%',
                          }}
                        />
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={() => setShowNewCategory(true)}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.main',
                      }}
                    >
                      <Add fontSize="small" />
                      Nova Categoria
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Checkbox de Importante */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.important}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData(prev => ({
                        ...prev,
                        important: e.target.checked,
                      }))
                    }
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label="Marcar como importante"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 500,
                    color: 'text.primary',
                  },
                }}
              />
            </Grid>

            {/* Status da Tarefa */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e: any) =>
                    setFormData(prev => ({
                      ...prev,
                      status: e.target.value as
                        | 'todo'
                        | 'in_progress'
                        | 'completed',
                    }))
                  }
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="todo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'error.main',
                          borderRadius: '50%',
                        }}
                      />
                      A Fazer
                    </Box>
                  </MenuItem>
                  <MenuItem value="in_progress">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'warning.main',
                          borderRadius: '50%',
                        }}
                      />
                      Em Andamento
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'success.main',
                          borderRadius: '50%',
                        }}
                      />
                      Concluída
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.title || !formData.category}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : taskId ? (
              'Atualizar Tarefa'
            ) : (
              'Criar Tarefa'
            )}
          </Button>
        </DialogActions>
      </Box>

      {/* Modal para Nova Categoria */}
      <Dialog
        open={showNewCategory}
        onClose={() => setShowNewCategory(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: '1.25rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          Nova Categoria
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Nome da Categoria"
            value={newCategoryName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewCategoryName(e.target.value)
            }
            required
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Escolha uma cor:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
            {predefinedColors.map(color => (
              <Box
                key={color}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: color,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border:
                    newCategoryColor === color ? '3px solid' : '2px solid',
                  borderColor:
                    newCategoryColor === color ? 'primary.main' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                }}
                onClick={() => setNewCategoryColor(color)}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button
            onClick={() => setShowNewCategory(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3, py: 1 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Criar Categoria
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
