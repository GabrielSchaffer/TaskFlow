import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { AuthForm } from './components/Auth/AuthForm';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { MyDayPage } from './pages/MyDayPage';
import { ImportantPage } from './pages/ImportantPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CustomThemeProvider } from './contexts/ThemeContext';

function App() {
  const { user, loading } = useAuth();
  const { settings } = useSettings(user?.id || '');

  if (loading) {
    return (
      <CustomThemeProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          Carregando...
        </Box>
      </CustomThemeProvider>
    );
  }

  if (!user) {
    return (
      <CustomThemeProvider>
        <CssBaseline />
        <AuthForm />
      </CustomThemeProvider>
    );
  }

  return (
    <CustomThemeProvider
      initialThemeId={settings?.color_theme || 'blue-purple'}
    >
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/my-day" element={<MyDayPage />} />
          <Route path="/important" element={<ImportantPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </CustomThemeProvider>
  );
}

export default App;
