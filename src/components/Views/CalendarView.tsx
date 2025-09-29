import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
import { Add } from '@mui/icons-material';
// Removido react-beautiful-dnd devido a problemas de compatibilidade
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
  const { deleteTask, updateTask } = useTasks(tasks[0]?.user_id || '');
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [currentDate] = useState(dayjs());
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<dayjs.Dayjs | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Sincronizar estado local com as tarefas
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handlePreviewTask = (task: Task) => {
    setPreviewTask(task);
  };

  const handleEditFromPreview = () => {
    if (previewTask) {
      setEditingTask(previewTask);
      setPreviewTask(null);
    }
  };

  // Funções para drag and drop customizado
  const handleMouseDown = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Mouse down on task:', task.title);

    // Calcular offset do mouse em relação ao card
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedTask(task);
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: offsetX, y: offsetY });

    console.log('States updated:', {
      isDragging: true,
      draggedTask: task.title,
      offset: { x: offsetX, y: offsetY },
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && draggedTask) {
      e.preventDefault();
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Verificar se está sobre um dia do calendário
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const dayElement = element.closest('[data-day]');
        if (dayElement) {
          const dayString = dayElement.getAttribute('data-day');
          if (dayString) {
            const day = dayjs(dayString);
            setDragOverDate(day);
          }
        } else {
          setDragOverDate(null);
        }
      }
    }
  };

  const handleMouseUp = async (e: MouseEvent) => {
    if (isDragging && draggedTask && dragOverDate) {
      // Atualizar a data da tarefa
      const updatedTask = {
        ...draggedTask,
        due_date: dragOverDate.toISOString(),
      };

      // Atualizar estado local imediatamente
      setLocalTasks(prevTasks =>
        prevTasks.map(task => (task.id === draggedTask.id ? updatedTask : task))
      );

      // Atualizar no banco de dados
      await updateTask(draggedTask.id, updatedTask);
    }

    // Limpar estados imediatamente
    setDraggedTask(null);
    setDragOverDate(null);
    setIsDragging(false);
    setMousePosition({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });
  };

  // Listener para capturar movimento do mouse durante drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevenir seleção de texto
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, draggedTask, dragOverDate]);

  const getTasksForDate = (date: dayjs.Dayjs) => {
    return localTasks.filter(task => {
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
                    data-day={day.format('YYYY-MM-DD')}
                    sx={{
                      minHeight: 160,
                      p: 1,
                      border: '1px solid',
                      borderColor: dragOverDate?.isSame(day, 'day')
                        ? '#4caf50'
                        : '#333',
                      borderRight: dayIndex === 6 ? 'none' : '1px solid #333',
                      borderBottom:
                        weekIndex < weeks.length - 1
                          ? '1px solid #333'
                          : 'none',
                      backgroundColor: dragOverDate?.isSame(day, 'day')
                        ? '#4caf50'
                        : isCurrentDay
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
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                      '&:hover': {
                        backgroundColor: isCurrentDay
                          ? '#1565c0'
                          : isCurrentMonthDay
                          ? '#2a2a2a'
                          : '#1a1a1a',
                      },
                      // Estilo quando está sendo arrastado sobre
                      ...(dragOverDate?.isSame(day, 'day') && {
                        backgroundColor: isCurrentDay
                          ? '#1565c0'
                          : isCurrentMonthDay
                          ? '#2a2a2a'
                          : '#1a1a1a',
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      }),
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

                    {/* Tarefas do dia - Grid 3x3 */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(3, 1fr)',
                        gap: 0.3,
                        flex: 1,
                        minHeight: '90px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Indicador de drop com card */}
                      {dragOverDate?.isSame(day, 'day') && draggedTask && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            pointerEvents: 'none',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              border: '2px dashed #4caf50',
                              borderRadius: 2,
                              p: 1.5,
                              minWidth: '140px',
                              maxWidth: '220px',
                              textAlign: 'center',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                mb: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor:
                                    priorityColors[draggedTask.priority],
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#4caf50',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {draggedTask.title}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#4caf50',
                                fontSize: '0.7rem',
                                opacity: 0.8,
                                display: 'block',
                              }}
                            >
                              → {day.format('DD/MM')}
                            </Typography>
                            {draggedTask.important && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#ff9800',
                                  fontSize: '0.7rem',
                                  display: 'block',
                                  mt: 0.5,
                                }}
                              >
                                ⭐ Importante
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}

                      {dayTasks.length > 0 && (
                        <Box>
                          {/* Layout adaptativo baseado na quantidade de tarefas */}
                          {dayTasks.length <= 3 ? (
                            // Layout em linha para 1-3 tarefas
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                flex: 1,
                              }}
                            >
                              {dayTasks.map((task, index) => (
                                <Box
                                  key={task.id}
                                  onMouseDown={e => handleMouseDown(e, task)}
                                  sx={{
                                    backgroundColor:
                                      priorityColors[task.priority],
                                    color: 'white',
                                    borderRadius: 1,
                                    p: 0.5,
                                    fontSize: '0.7rem',
                                    cursor:
                                      isDragging && draggedTask?.id === task.id
                                        ? 'grabbing'
                                        : 'grab',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minHeight: '24px',
                                    position:
                                      isDragging && draggedTask?.id === task.id
                                        ? 'fixed'
                                        : 'relative',
                                    zIndex:
                                      isDragging && draggedTask?.id === task.id
                                        ? 9999
                                        : 'auto',
                                    transform:
                                      isDragging && draggedTask?.id === task.id
                                        ? `translate(${
                                            mousePosition.x - dragOffset.x
                                          }px, ${
                                            mousePosition.y - dragOffset.y
                                          }px) rotate(2deg) scale(1.05)`
                                        : 'none',
                                    opacity:
                                      isDragging && draggedTask?.id === task.id
                                        ? 0.8
                                        : 1,
                                    boxShadow:
                                      isDragging && draggedTask?.id === task.id
                                        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                                        : 'none',
                                    '&:hover': {
                                      opacity: 0.8,
                                      transform:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? `translate(${
                                              mousePosition.x - dragOffset.x
                                            }px, ${
                                              mousePosition.y - dragOffset.y
                                            }px) rotate(2deg) scale(1.05)`
                                          : 'scale(1.02)',
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      flex: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 'bold',
                                        fontSize: '0.65rem',
                                        lineHeight: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1,
                                      }}
                                    >
                                      {task.title.length > 12
                                        ? `${task.title.substring(0, 12)}...`
                                        : task.title}
                                    </Typography>
                                    {task.important && (
                                      <Typography sx={{ fontSize: '0.6rem' }}>
                                        ⭐
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: '0.6rem',
                                      opacity: 0.8,
                                      ml: 0.5,
                                    }}
                                  >
                                    {formatTaskTime(task)}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            // Layout em grid para 4+ tarefas
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gridTemplateRows: 'repeat(3, 1fr)',
                                gap: 0.3,
                                flex: 1,
                                minHeight: '90px',
                                overflow: 'hidden',
                              }}
                            >
                              {dayTasks.slice(0, 9).map((task, index) => (
                                <Tooltip
                                  key={task.id}
                                  title={`${task.title} - ${
                                    task.description || 'Sem descrição'
                                  }`}
                                >
                                  <Box
                                    onMouseDown={e => handleMouseDown(e, task)}
                                    sx={{
                                      backgroundColor:
                                        priorityColors[task.priority],
                                      color: 'white',
                                      borderRadius: 1,
                                      p: 0.3,
                                      fontSize: '0.6rem',
                                      cursor:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? 'grabbing'
                                          : 'grab',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      minHeight: '20px',
                                      position:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? 'fixed'
                                          : 'relative',
                                      zIndex:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? 9999
                                          : 'auto',
                                      transform:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? `translate(${
                                              mousePosition.x - dragOffset.x
                                            }px, ${
                                              mousePosition.y - dragOffset.y
                                            }px) rotate(2deg) scale(1.05)`
                                          : 'none',
                                      opacity:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? 0.8
                                          : 1,
                                      boxShadow:
                                        isDragging &&
                                        draggedTask?.id === task.id
                                          ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                                          : 'none',
                                      '&:hover': {
                                        opacity: 0.8,
                                        transform:
                                          isDragging &&
                                          draggedTask?.id === task.id
                                            ? `translate(${
                                                mousePosition.x - dragOffset.x
                                              }px, ${
                                                mousePosition.y - dragOffset.y
                                              }px) rotate(2deg) scale(1.05)`
                                            : 'scale(1.05)',
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 'bold',
                                        fontSize: '0.5rem',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {formatTaskTime(task)}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.5rem',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                      }}
                                    >
                                      {task.title.length > 8
                                        ? `${task.title.substring(0, 8)}...`
                                        : task.title}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ fontSize: '0.5rem' }}
                                    >
                                      {priorityIcons[task.priority]}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              ))}

                              {/* Contador para tarefas extras (acima de 9) */}
                              {dayTasks.length > 9 && (
                                <Box
                                  sx={{
                                    backgroundColor: '#444',
                                    color: '#b0b0b0',
                                    borderRadius: 0.5,
                                    p: 0.3,
                                    textAlign: 'center',
                                    fontSize: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '20px',
                                    gridColumn: '1 / -1',
                                    '&:hover': {
                                      backgroundColor: '#555',
                                    },
                                  }}
                                  onClick={(
                                    e: React.MouseEvent<HTMLElement>
                                  ) => {
                                    e.stopPropagation();
                                    handleDateChange(day);
                                  }}
                                >
                                  +{dayTasks.length - 9} tarefas
                                </Box>
                              )}
                            </Box>
                          )}
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
              Tarefas para {selectedDate?.format('DD/MM/YYYY')}
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

          {selectedDate && getTasksForDate(selectedDate).length === 0 ? (
            <Alert severity="info">Nenhuma tarefa para este dia</Alert>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minHeight: 50,
              }}
            >
              {selectedDate &&
                getTasksForDate(selectedDate).map((task, index) => (
                  <Card
                    key={task.id}
                    onMouseDown={e => handleMouseDown(e, task)}
                    sx={{
                      mb: 1,
                      cursor:
                        isDragging && draggedTask?.id === task.id
                          ? 'grabbing'
                          : 'grab',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #333',
                      transition:
                        draggedTask?.id === task.id ? 'none' : 'all 0.2s ease',
                      opacity: draggedTask?.id === task.id ? 0.8 : 1,
                      transform:
                        draggedTask?.id === task.id
                          ? `translate(${mousePosition.x - dragOffset.x}px, ${
                              mousePosition.y - dragOffset.y
                            }px) rotate(2deg) scale(1.05)`
                          : 'none',
                      position:
                        draggedTask?.id === task.id ? 'fixed' : 'relative',
                      zIndex: draggedTask?.id === task.id ? 9999 : 'auto',
                      boxShadow:
                        draggedTask?.id === task.id
                          ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                          : 'none',
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                      '&:active': {
                        cursor: 'grabbing',
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
                            sx={{
                              fontWeight: 'bold',
                              mb: 0.5,
                              color: 'white',
                            }}
                          >
                            {task.title}
                          </Typography>

                          {task.description && (
                            <Box
                              sx={{
                                mb: 1,
                                color: '#b0b0b0',
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                  color: '#b0b0b0',
                                  margin: '2px 0',
                                  fontSize: '0.875rem',
                                },
                                '& p': {
                                  color: '#b0b0b0',
                                  margin: '1px 0',
                                  fontSize: '0.875rem',
                                },
                                '& strong, & b': {
                                  fontWeight: 'bold',
                                  color: '#b0b0b0',
                                },
                                '& em, & i': {
                                  fontStyle: 'italic',
                                  color: '#b0b0b0',
                                },
                                '& u': {
                                  textDecoration: 'underline',
                                  color: '#b0b0b0',
                                },
                                '& s, & strike': {
                                  textDecoration: 'line-through',
                                  color: '#b0b0b0',
                                },
                                '& a': {
                                  color: '#64b5f6',
                                  textDecoration: 'underline',
                                },
                                '& ul, & ol': {
                                  paddingLeft: '12px',
                                  color: '#b0b0b0',
                                },
                                '& li': {
                                  color: '#b0b0b0',
                                  margin: '1px 0',
                                },
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  task.description.length > 100
                                    ? `${task.description.substring(0, 100)}...`
                                    : task.description,
                              }}
                            />
                          )}

                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              flexWrap: 'wrap',
                            }}
                          >
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
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </Paper>
      )}

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
