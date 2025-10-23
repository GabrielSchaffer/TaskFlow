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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Add, ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
// Removido react-beautiful-dnd devido a problemas de compatibilidade
import { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../contexts/ThemeContext';
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
  const { colorTheme } = useTheme();
  const { deleteTask, updateTask } = useTasks(tasks[0]?.user_id || '');
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState(dayjs()); // Agora é dinâmico
  const [showNewTask, setShowNewTask] = useState(false);

  // Sincronizar localTasks com tasks quando tasks mudar
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Sincronizar previewTask quando localTasks mudar
  useEffect(() => {
    if (previewTask) {
      const updatedTask = localTasks.find(t => t.id === previewTask.id);
      if (updatedTask) {
        setPreviewTask(updatedTask);
      }
    }
  }, [localTasks, previewTask]);

  // Função para atualizar tarefa com atualização otimista
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    console.log('🔄 CalendarView handleUpdateTask chamado:', { taskId, updates });
    // Atualização otimista - atualizar UI imediatamente
    const taskToUpdate = localTasks.find(t => t.id === taskId);
    
    setLocalTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId
          ? { ...t, ...updates, updated_at: new Date().toISOString() }
          : t
      )
    );
    
    try {
      await updateTask(taskId, updates);
    } catch (error) {
      // Reverter em caso de erro
      console.error('Erro ao atualizar tarefa:', error);
      if (taskToUpdate) {
        setLocalTasks(prevTasks =>
          prevTasks.map(t => (t.id === taskId ? taskToUpdate : t))
        );
      }
    }
  };
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<dayjs.Dayjs | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseStartPosition, setMouseStartPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null);

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

  const handleShowAllTasks = (day: dayjs.Dayjs, dayTasks: Task[]) => {
    setSelectedDay(day);
    setSelectedDayTasks(dayTasks);
    setShowTasksModal(true);
  };

  const handleCloseTasksModal = () => {
    setShowTasksModal(false);
    setSelectedDay(null);
    setSelectedDayTasks([]);
  };

  // Funções de navegação do calendário
  const goToPreviousMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
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
    setMousePosition({ x: e.clientX, y: e.clientY });
    setMouseStartPosition({ x: e.clientX, y: e.clientY }); // Posição inicial
    setDragOffset({ x: offsetX, y: offsetY });
    setHasMoved(false); // Reset movimento
    // NÃO setamos isDragging ainda - só após movimento significativo

    console.log('States updated:', {
      draggedTask: task.title,
      offset: { x: offsetX, y: offsetY },
      startPosition: { x: e.clientX, y: e.clientY },
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedTask) {
      e.preventDefault();

      // Calcular distância do movimento
      const deltaX = Math.abs(e.clientX - mouseStartPosition.x);
      const deltaY = Math.abs(e.clientY - mouseStartPosition.y);
      const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Se moveu mais de 5 pixels, considera como drag
      if (moveDistance > 5 && !isDragging) {
        setIsDragging(true);
        setHasMoved(true);
        console.log('Movimento detectado - iniciando drag');
      }

      if (isDragging) {
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
    }
  };

  const handleMouseUp = async (e: MouseEvent) => {
    if (draggedTask) {
      if (isDragging && dragOverDate) {
        // Foi um drag real - atualizar a data da tarefa
        const updatedTask = {
          ...draggedTask,
          due_date: dragOverDate.toISOString(),
        };

        // Atualizar estado local imediatamente
        setLocalTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === draggedTask.id ? updatedTask : task
          )
        );

        // Atualizar no banco de dados
        await updateTask(draggedTask.id, updatedTask);
        console.log('Tarefa movida para:', dragOverDate.format('DD/MM/YYYY'));
      } else if (!hasMoved) {
        // Foi um clique simples (sem movimento) - abrir preview
        console.log('Clique simples detectado - abrindo preview');
        handlePreviewTask(draggedTask);
      }
    }

    // Limpar estados imediatamente
    setDraggedTask(null);
    setDragOverDate(null);
    setIsDragging(false);
    setMousePosition({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });
    setMouseStartPosition({ x: 0, y: 0 });
    setHasMoved(false);
  };

  // Listener para capturar movimento do mouse durante possível drag
  useEffect(() => {
    if (draggedTask) {
      // Escuta se tem tarefa selecionada (não apenas se isDragging)
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevenir seleção de texto
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [draggedTask, isDragging, dragOverDate]); // Dependências atualizadas

  const getTasksForDate = (date: dayjs.Dayjs) => {
    return localTasks.filter(task => {
      const taskDate = dayjs(task.due_date);
      return taskDate.isSame(date, 'day') && task.status !== 'completed';
    });
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setSelectedDate(newDate);
    // Removido: setShowNewTask(true) - apenas seleciona o dia para mostrar tarefas
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

  // Função para verificar se uma tarefa está vencida
  const isTaskOverdue = (task: Task) => {
    const taskDate = dayjs(task.due_date);
    const today = dayjs();
    return taskDate.isBefore(today, 'day') && task.status !== 'completed';
  };

  // Função para obter a cor da tarefa baseada no status
  const getTaskColor = (task: Task) => {
    if (isTaskOverdue(task)) {
      return '#d32f2f'; // Vermelho para tarefas vencidas
    }
    return priorityColors[task.priority];
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
    <Box
      sx={{
        p: { xs: 0.5, sm: 2, md: 3 }, // Padding responsivo - muito menor no mobile
        backgroundColor: 'background.default',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden', // Evita overflow horizontal
      }}
    >
      {/* Header de Navegação do Calendário */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Sempre em linha
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 }, // Gap menor em mobile
          mb: { xs: "4px", sm: 1 }, // Margin bottom responsivo - menor no mobile
          p: { xs: 1, sm: 2 }, // Padding responsivo
          backgroundColor: '#1e1e1e',
          borderRadius: 2,
          border: '1px solid #333',
        }}
      >
        {/* Botão Mês Anterior */}
        <Button
          variant="outlined"
          size="small"
          onClick={goToPreviousMonth}
          sx={{
            minWidth: { xs: '32px', sm: '40px' }, // Menor em mobile
            height: { xs: '32px', sm: '36px' }, // Altura responsiva
            color: '#ffffff',
            borderColor: '#555',
            '&:hover': {
              borderColor: '#777',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ChevronLeft sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </Button>

        {/* Mês e Ano Atual + Botão Hoje */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 0,
          gap: { xs: 1, sm: 1 },
          flex: 1,
          justifyContent: 'center'
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.5rem' }, // Fonte menor em mobile
              minWidth: { xs: '120px', sm: '200px' }, // Largura menor em mobile
            }}
          >
            {currentDate.format('MMMM YYYY')}
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={goToToday}
            startIcon={<Today sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
            sx={{
              backgroundColor: colorTheme.id === 'dark-gold' ? '#FFC700' : '#1976d2',
              color: colorTheme.id === 'dark-gold' ? '#000' : 'white',
              fontSize: { xs: '0.7rem', sm: '0.875rem' }, // Fonte menor em mobile
              px: { xs: 1, sm: 2 }, // Padding horizontal responsivo
              py: { xs: 0.5, sm: 1 }, // Padding vertical responsivo
              '&:hover': {
                backgroundColor: colorTheme.id === 'dark-gold' ? '#E6B300' : '#1565c0',
              },
            }}
          >
            Hoje
          </Button>
        </Box>

        {/* Botão Próximo Mês */}
        <Button
          variant="outlined"
          size="small"
          onClick={goToNextMonth}
          sx={{
            minWidth: { xs: '32px', sm: '40px' }, // Menor em mobile
            height: { xs: '32px', sm: '36px' }, // Altura responsiva
            color: '#ffffff',
            borderColor: '#555',
            '&:hover': {
              borderColor: '#777',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ChevronRight sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </Button>
      </Box>

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
                  p: { xs: 1, sm: 2 }, // Padding responsivo
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0b0b0',
                  borderBottom: '1px solid',
                  borderColor: '#333',
                  backgroundColor: '#2a2a2a',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.875rem' }, // Tamanho responsivo
                    display: { xs: 'none', sm: 'block' }, // Escondido em mobile
                  }}
                >
                  {day}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.7rem',
                    display: { xs: 'block', sm: 'none' }, // Mostrado apenas em mobile
                  }}
                >
                  {day.substring(0, 3)}{' '}
                  {/* Apenas as 3 primeiras letras em mobile */}
                </Typography>
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
                      height: { xs: 100, sm: 120, md: 140 }, // Altura responsiva reduzida
                      maxHeight: { xs: 100, sm: 120, md: 140 }, // Max height responsivo reduzido
                      p: { xs: 0.3, sm: 0.5, md: 1 }, // Padding responsivo
                      minHeight: { xs: 100, sm: 120, md: 140 }, // Altura mínima para consistência
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
                      overflow: 'hidden', // Esconde conteúdo que extrapola
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
                    onClick={() => setSelectedDate(day)} // Mostra tarefas do dia na seção inferior
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
                          fontSize: {
                            xs: '0.8rem',
                            sm: '0.9rem',
                            md: isCurrentDay ? '1.1rem' : '0.9rem',
                          }, // Fonte responsiva
                        }}
                      >
                        {day.format('D')}
                      </Typography>

                      {isCurrentDay && (
                        <Box
                          sx={{
                            width: { xs: 6, sm: 8 }, // Tamanho responsivo
                            height: { xs: 6, sm: 8 }, // Tamanho responsivo
                            borderRadius: '50%',
                            backgroundColor: '#42a5f5',
                          }}
                        />
                      )}
                    </Box>

                    {/* Tarefas do dia - Container com altura responsiva */}
                    <Box
                      sx={{
                        flex: 1,
                        maxHeight: { xs: '60px', sm: '80px', md: '100px' }, // Altura máxima responsiva reduzida
                        overflow: 'hidden', // Esconde overflow
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%', // Garante que o container use toda a largura
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
                        <Box
                          sx={{
                            height: '100%',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.3,
                          }}
                        >
                          {/* Layout: no mobile mostra apenas "X tarefas", no desktop mostra cards individuais */}
                          {window.innerWidth >= 600 ? (
                            // Desktop: mostra cards individuais
                            <>
                              {dayTasks.length <= 3 ? (
                                // Se 3 ou menos tarefas, mostra todas
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.3,
                                    height: '100%',
                                    overflow: 'hidden',
                                    width: '100%',
                                  }}
                                >
                                  {dayTasks.map((task, index) => (
                                    <Box
                                      key={task.id}
                                      onMouseDown={e =>
                                        handleMouseDown(e, task)
                                      }
                                      onClick={e => {
                                        e.stopPropagation();
                                        handlePreviewTask(task);
                                      }}
                                      sx={{
                                        backgroundColor: getTaskColor(task),
                                        color: 'white',
                                        borderRadius: 1,
                                        p: 0.5,
                                        fontSize: '0.7rem',
                                        cursor:
                                          isDragging &&
                                          draggedTask?.id === task.id
                                            ? 'grabbing'
                                            : 'grab',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        minHeight: '20px',
                                        flex: 1,
                                        maxHeight: '28px',

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
                                          borderRadius: 1,
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
                                      {/* Checkbox */}
                                      <Box
                                        sx={{
                                          width: 12,
                                          height: 12,
                                          backgroundColor: '#1976d2',
                                          borderRadius: 0.5,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            fontWeight: 'bold',
                                          }}
                                        >
                                          ✓
                                        </Typography>
                                      </Box>

                                      {/* Título truncado com estrela para tarefas importantes */}
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: '600',
                                            fontSize: '0.7rem',
                                            lineHeight: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            flex: 1,
                                            color: '#191919',
                                          }}
                                        >
                                          {task.title.length > 22
                                            ? `${task.title.substring(0, 22)}...`
                                            : task.title}
                                        </Typography>
                                        {task.important && (
                                          <Typography
                                            sx={{
                                              fontSize: '0.7rem',
                                              color: '#ff9800',
                                              flexShrink: 0,
                                            }}
                                          >
                                            ⭐
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                // Se mais de 3 tarefas, mostra 3 + "Mais X"
                                <>
                                  {dayTasks.slice(0, 3).map((task, index) => (
                                    <Box
                                      key={task.id}
                                      onMouseDown={e =>
                                        handleMouseDown(e, task)
                                      }
                                      onClick={e => {
                                        e.stopPropagation();
                                        handlePreviewTask(task);
                                      }}
                                      sx={{
                                        backgroundColor: getTaskColor(task),
                                        color: 'white',
                                        borderRadius: 1,
                                        p: 0.5,
                                        fontSize: '0.7rem',
                                        cursor:
                                          isDragging &&
                                          draggedTask?.id === task.id
                                            ? 'grabbing'
                                            : 'grab',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        minHeight: '20px',
                                        flex: 1,
                                        maxHeight: '28px',
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
                                          borderRadius: 1,
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
                                      {/* Checkbox */}
                                      <Box
                                        sx={{
                                          width: 12,
                                          height: 12,
                                          backgroundColor: '#1976d2',
                                          borderRadius: 0.5,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            fontWeight: 'bold',
                                          }}
                                        >
                                          ✓
                                        </Typography>
                                      </Box>

                                      {/* Título truncado com estrela para tarefas importantes */}
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
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
                                            color: '#191919',
                                          }}
                                        >
                                          {task.title.length > 22
                                            ? `${task.title.substring(0, 22)}...`
                                            : task.title}
                                        </Typography>
                                        {task.important && (
                                          <Typography
                                            sx={{
                                              fontSize: '0.7rem',
                                              color: '#ff9800',
                                              flexShrink: 0,
                                            }}
                                          >
                                            ⭐
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  ))}

                                  {/* Card "Mais X" */}
                                  <Box
                                    sx={{
                                      backgroundColor: '#666',
                                      color: '#191919',
                                      borderRadius: 1,
                                      textAlign: 'left',
                                      fontSize: '0.7rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      p: 0.5,
                                      minHeight: 'auto',
                                      maxHeight: '28px',
                                      width: '100%',
                                      overflow: 'hidden',
                                      paddingLeft: '5px',
                                      justifyContent: 'left',
                                      flex: 1,
                                      fontWeight: 'bold',
                                      '&:hover': {
                                        backgroundColor: '#777',
                                        borderRadius: 1,
                                      },
                                    }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleShowAllTasks(day, dayTasks);
                                    }}
                                  >
                                    Mais {dayTasks.length - 3}
                                  </Box>
                                </>
                              )}
                            </>
                          ) : (
                            // Mobile: mostra apenas "X tarefas"
                            <Box
                              sx={{
                                height: '100%',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.3,
                              }}
                            >
                              <Box
                                onClick={() =>
                                  handleShowAllTasks(day, dayTasks)
                                }
                                sx={{
                                  backgroundColor: '#666',
                                  color: '#191919',
                                  borderRadius: 1,
                                  textAlign: 'center',
                                  fontSize: '0.6rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  p: 0.5,
                                  minHeight: '20px',
                                  width: '100%',
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    backgroundColor: '#777',
                                    borderRadius: "1 !important",
                                  },
                                }}
                              >
                                {dayTasks.length}{' '}
                                {dayTasks.length === 1 ? 'tarefa' : 'tarefas'}
                              </Box>
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

      {/* Modal de Todas as Tarefas do Dia */}
      <Dialog
        open={showTasksModal}
        onClose={handleCloseTasksModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedDay &&
            `${selectedDay.date()} de ${selectedDay.format('MMMM')}`}
          <IconButton
            onClick={handleCloseTasksModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDayTasks.map(task => (
            <Box
              key={task.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                mb: 1,
                backgroundColor: getTaskColor(task),
                color: 'white',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  borderRadius: 1,
                },
              }}
              onClick={() => {
                handleCloseTasksModal();
                handlePreviewTask(task);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    flex: 1,
                  }}
                >
                  {task.title}
                </Typography>
                {task.important && (
                  <Typography sx={{ fontSize: '1rem' }}>⭐</Typography>
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  ml: 1,
                }}
              >
                {formatTaskTime(task)}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTasksModal}>Fechar</Button>
        </DialogActions>
      </Dialog>

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
          onUpdateTask={handleUpdateTask}
        />
      )}
    </Box>
  );
};
