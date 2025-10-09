import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskFormData } from '../types';

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para forçar refresh
  const forceRefresh = () => {
    console.log('🔄 Forçando refresh das tarefas');
    setRefreshKey(prev => prev + 1);
    fetchTasks();
  };

  useEffect(() => {
    if (!userId) return;

    fetchTasks();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`tasks-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔔 Real-time event received:', payload.eventType, payload.new);
          // Sempre fazer refresh quando há mudanças via real-time
          setTimeout(() => fetchTasks(), 200);
        }
      )
      .subscribe((status) => {
        console.log('📡 Supabase subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchTasks = async () => {
    try {
      console.log('🔄 Buscando tarefas do usuário:', userId);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ Tarefas encontradas:', data?.length || 0);
      setTasks(data || []);
    } catch (error) {
      console.error('❌ Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskFormData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar imediatamente ao estado local para feedback instantâneo
      if (data) {
        console.log('✅ Adicionando nova tarefa ao estado:', data.title);
        setTasks(prev => [data, ...prev]);
        // Força refresh adicional para garantir sincronização
        setTimeout(() => forceRefresh(), 100);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating task:', error);
      return { data: null, error };
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar imediatamente no estado local
      if (data) {
        setTasks(prev => 
          prev.map(task => task.id === id ? data : task)
        );
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      return { data: null, error };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;

      // Remover imediatamente do estado local
      setTasks(prev => prev.filter(task => task.id !== id));

      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { error };
    }
  };

  const moveTaskToNextDay = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return { error: 'Task not found' };

      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);

      // Increase priority
      const priorityOrder = { Baixa: 'Média', Média: 'Alta', Alta: 'Alta' };
      const newPriority = priorityOrder[task.priority] as
        | 'Alta'
        | 'Média'
        | 'Baixa';

      const updatedTask = {
        ...task,
        due_date: nextDay.toISOString(),
        priority: newPriority,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tasks')
        .update({
          due_date: nextDay.toISOString(),
          priority: newPriority,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      // Atualizar imediatamente no estado local
      setTasks(prev => 
        prev.map(t => t.id === taskId ? updatedTask : t)
      );

      return { error: null };
    } catch (error) {
      console.error('Error moving task to next day:', error);
      return { error };
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    moveTaskToNextDay,
    forceRefresh,
    refreshKey,
  };
};
