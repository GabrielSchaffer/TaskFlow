import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { TaskForm } from '../Tasks/TaskForm';
import { TaskPreview } from '../Tasks/TaskPreview';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

interface CalendarViewProps {
  tasks: Task[];
  loading: boolean;
}

const priorityColors = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#2196f3',
} as const;

const priorityIcons = {
  Alta: '🔴',
  Média: '🟡',
  Baixa: '🔵',
} as const;

export const CalendarView = ({ tasks, loading }: CalendarViewProps) => {
  const { deleteTask } = useTasks(tasks[0]?.user_id || '');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentDate] = useState(dayjs());
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handlePreviewTask = (task: Task) => {
    setPreviewTask(task);
  };

  const handleEditFromPreview = () => {
    if (previewTask) {
      setEditingTask(previewTask);
      setPreviewTask(null);
    }
  };

  const handleViewTask = () => {
    if (selectedTask) {
      setPreviewTask(selectedTask);
      handleMenuClose();
    }
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      handleMenuClose();
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id);
      handleMenuClose();
    }
  };

  const getTasksForDate = (date: dayjs.Dayjs) => {
    return tasks.filter(task => {
      const taskDate = dayjs(task.due_date);
      return taskDate.isSame(date, 'day');
    });
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      setShowNewTask(true);
    }
  };

  const getCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let current = startOfWeek;

    while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }

    return days;
  };

  const isToday = (date: dayjs.Dayjs) => {
    return date.isSame(dayjs(), 'day');
  };

  const isCurrentMonth = (date: dayjs.Dayjs) => {
    return date.isSame(currentDate, 'month');
  };

  const formatTaskTime = (task: Task) => {
    const taskDate = dayjs(task.due_date);
    return taskDate.format('HH:mm');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const calendarDays = getCalendarDays();
  const weekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  // Organizar dias em semanas (7 dias por linha)
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      {/* Calendário Grid */}
      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
        }}
      >
        {/* Cabeçalho dos Dias da Semana */}
        <Grid container>
          {weekDays.map(day => (
            <Grid item xs key={day}>
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0b0b0',
                  borderBottom: '1px solid',
                  borderColor: '#333',
                  backgroundColor: '#2a2a2a',
                }}
              >
                <Typography variant="body2">{day}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Grade do Calendário - Organizada por semanas */}
        {weeks.map((week, weekIndex) => (
          <Grid container key={weekIndex}>
            {week.map((day, dayIndex) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentDay = isToday(day);
              const isCurrentMonthDay = isCurrentMonth(day);
              const isWeekend = day.day() === 0 || day.day() === 6;

              return (
                <Grid item xs key={`${weekIndex}-${dayIndex}`}>
                  <Box
                    sx={{
                      minHeight: 120,
                      p: 1,
                      border: '1px solid',
                      borderColor: '#333',
                      borderRight: dayIndex === 6 ? 'none' : '1px solid #333',
                      borderBottom:
                        weekIndex < weeks.length - 1
                          ? '1px solid #333'
                          : 'none',
                      backgroundColor: isCurrentDay
                        ? '#1976d2'
                        : isWeekend
                        ? '#2a2a2a'
                        : isCurrentMonthDay
                        ? '#1e1e1e'
                        : '#0f0f0f',
                      color: isCurrentDay
                        ? 'white'
                        : isCurrentMonthDay
                        ? 'white'
                        : '#666',
                      opacity: isCurrentMonthDay ? 1 : 0.4,
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: isCurrentDay
                          ? '#1565c0'
                          : isCurrentMonthDay
                          ? '#2a2a2a'
                          : '#1a1a1a',
                      },
                    }}
                    onClick={() => handleDateChange(day)}
                  >
                    {/* Número do Dia */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isCurrentDay ? 'bold' : 'normal',
                          fontSize: isCurrentDay ? '1.1rem' : '0.9rem',
                        }}
                      >
                        {day.format('D')}
                      </Typography>

                      {isCurrentDay && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#42a5f5',
                          }}
                        />
                      )}
                    </Box>

                    {/* Tarefas do dia */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      {dayTasks.slice(0, 3).map((task, taskIndex) => (
                        <Tooltip
                          key={task.id}
                          title={`${task.title} - ${
                            task.description || 'Sem descrição'
                          }`}
                        >
                          <Box
                            sx={{
                              backgroundColor: priorityColors[task.priority],
                              color: 'white',
                              borderRadius: 1,
                              p: 0.5,
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              '&:hover': {
                                opacity: 0.8,
                              },
                            }}
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                              e.stopPropagation();
                              handleMenuOpen(e, task);
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {formatTaskTime(task)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {task.title}
                            </Typography>
                            <Typography variant="caption">
                              {priorityIcons[task.priority]}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}

                      {dayTasks.length > 3 && (
                        <Box
                          sx={{
                            backgroundColor: '#444',
                            color: '#b0b0b0',
                            borderRadius: 1,
                            p: 0.5,
                            textAlign: 'center',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#555',
                            },
                          }}
                          onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation();
                            handleDateChange(day);
                          }}
                        >
                          +{dayTasks.length - 3} mais
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Paper>

      {/* Lista de Tarefas do Dia Selecionado */}
      {selectedDate && (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            mt: 3,
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              Tarefas para {selectedDate.format('DD/MM/YYYY')}
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowNewTask(true)}
              size="small"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Nova Tarefa
            </Button>
          </Box>

          {getTasksForDate(selectedDate).length === 0 ? (
            <Alert severity="info">Nenhuma tarefa para este dia</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {getTasksForDate(selectedDate).map(task => (
                <Card
                  key={task.id}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handlePreviewTask(task);
                  }}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #333',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'bold', mb: 0.5, color: 'white' }}
                        >
                          {task.title}
                        </Typography>

                        {task.description && (
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: '#b0b0b0' }}
                          >
                            {task.description.length > 100
                              ? `${task.description.substring(0, 100)}...`
                              : task.description}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              backgroundColor: priorityColors[task.priority],
                              color: 'white',
                            }}
                          />

                          {task.category && (
                            <Chip
                              label={task.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                color: '#b0b0b0',
                                borderColor: '#555',
                                '&:hover': {
                                  borderColor: '#777',
                                },
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          handleMenuOpen(e, task);
                        }}
                        sx={{ color: '#b0b0b0' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* Menu de Ações da Tarefa */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewTask}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Visualizar</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEditTask}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteTask} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Nova/Edição de Tarefa */}
      <TaskForm
        open={showNewTask || Boolean(editingTask)}
        onClose={() => {
          setShowNewTask(false);
          setEditingTask(null);
        }}
        userId={tasks[0]?.user_id || ''}
        taskId={editingTask?.id}
        onTaskUpdated={() => {
          // Forçar atualização do calendário
          window.location.reload();
        }}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description || '',
                due_date: editingTask.due_date,
                priority: editingTask.priority,
                category: editingTask.category,
                important: editingTask.important,
                status: editingTask.status,
              }
            : selectedDate
            ? {
                title: '',
                description: '',
                due_date: selectedDate.toISOString(),
                priority: 'Média' as const,
                category: '',
                important: false,
                status: 'todo' as const,
              }
            : undefined
        }
      />

      {previewTask && (
        <TaskPreview
          open={Boolean(previewTask)}
          onClose={() => setPreviewTask(null)}
          task={previewTask}
          onEdit={handleEditFromPreview}
        />
      )}
    </Box>
  );
};
