import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskFormData } from '../types';

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetchTasks();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
          status: 'todo',
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar o estado local imediatamente
      await fetchTasks();

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

      // Atualizar o estado local imediatamente
      await fetchTasks();

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

      // Atualizar o estado local imediatamente
      await fetchTasks();

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

      const { error } = await supabase
        .from('tasks')
        .update({
          due_date: nextDay.toISOString(),
          priority: newPriority,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      // Atualizar o estado local imediatamente
      await fetchTasks();

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
  };
};
