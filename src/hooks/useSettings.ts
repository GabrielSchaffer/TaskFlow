import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserSettings, ThemeMode, ViewMode } from '../types';

export const useSettings = (userId: string) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const defaultSettings = {
          user_id: userId,
          theme: 'light' as ThemeMode,
          default_view: 'kanban' as ViewMode,
          color_theme: 'blue-purple',
        };

        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { data: null, error };
    }
  };

  const updateTheme = async (theme: ThemeMode) => {
    return updateSettings({ theme });
  };

  const updateDefaultView = async (view: ViewMode) => {
    return updateSettings({ default_view: view });
  };

  const updateColorTheme = async (colorTheme: string) => {
    return updateSettings({ color_theme: colorTheme });
  };

  return {
    settings,
    loading,
    updateSettings,
    updateTheme,
    updateDefaultView,
    updateColorTheme,
  };
};
