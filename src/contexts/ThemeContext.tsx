import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getColorTheme, ColorTheme } from '../constants/colorThemes';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialThemeId?: string;
}

export const CustomThemeProvider = ({
  children,
  initialThemeId = 'blue-purple',
}: ThemeProviderProps) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    getColorTheme(initialThemeId)
  );

  const setColorTheme = (themeId: string) => {
    console.log('🔄 Mudando tema para:', themeId);
    const newTheme = getColorTheme(themeId);
    setColorThemeState(newTheme);

    // Salvar no localStorage para persistir entre sessões
    localStorage.setItem('taskflow-color-theme', themeId);
  };

  // Carregar tema do localStorage na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('taskflow-color-theme');
    if (savedTheme) {
      setColorThemeState(getColorTheme(savedTheme));
    }
  }, []);

  // Sincronizar com o banco de dados quando o tema mudar
  useEffect(() => {
    if (initialThemeId && initialThemeId !== 'blue-purple') {
      setColorThemeState(getColorTheme(initialThemeId));
      localStorage.setItem('taskflow-color-theme', initialThemeId);
    }
  }, [initialThemeId]);

  // Criar tema do Material-UI com as cores personalizadas
  console.log('🎨 Aplicando tema:', colorTheme.id, colorTheme.name);
  console.log('🎨 Cores do tema:', colorTheme);
  
  // Detectar se é o tema escuro dourado
  const isDarkGoldTheme = colorTheme.id === 'dark-gold';
  
  const muiTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: colorTheme.primary,
      },
      secondary: {
        main: colorTheme.secondary,
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#fff',
        secondary: '#b0b0b0',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
          contained: {
            background: colorTheme.buttonGradient,
            color: isDarkGoldTheme ? '#000' : 'white',
            '&:hover': {
              background: colorTheme.buttonGradient,
              filter: 'brightness(0.9)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
