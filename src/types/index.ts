export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  category: string;
  status: 'todo' | 'in_progress' | 'completed';
  important: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  default_view: 'kanban' | 'calendar';
  color_theme: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  category: string;
  important: boolean;
  status: 'todo' | 'in_progress' | 'completed';
}

export type Priority = 'Alta' | 'Média' | 'Baixa';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type ViewMode = 'kanban' | 'calendar';
export type ThemeMode = 'light' | 'dark';
