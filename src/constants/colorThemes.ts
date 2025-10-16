export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  sidebarGradient: string;
  buttonGradient: string;
}

export const colorThemes: ColorTheme[] = [
  {
    id: 'blue-purple',
    name: 'Azul & Roxo',
    primary: '#1976d2',
    secondary: '#9c27b0',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
    sidebarGradient: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
    buttonGradient: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
  },
  {
    id: 'green-teal',
    name: 'Verde & Azul',
    primary: '#4caf50',
    secondary: '#00bcd4',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #00bcd4 100%)',
    sidebarGradient: 'linear-gradient(135deg, #4caf50 0%, #00bcd4 100%)',
    buttonGradient: 'linear-gradient(135deg, #4caf50 0%, #00bcd4 100%)',
  },
  {
    id: 'orange-red',
    name: 'Laranja & Vermelho',
    primary: '#ff9800',
    secondary: '#f44336',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #f44336 100%)',
    sidebarGradient: 'linear-gradient(135deg, #ff9800 0%, #f44336 100%)',
    buttonGradient: 'linear-gradient(135deg, #ff9800 0%, #f44336 100%)',
  },
  {
    id: 'purple-pink',
    name: 'Roxo & Rosa',
    primary: '#9c27b0',
    secondary: '#e91e63',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
    sidebarGradient: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
    buttonGradient: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
  },
  {
    id: 'cyan-blue',
    name: 'Ciano & Azul',
    primary: '#00bcd4',
    secondary: '#2196f3',
    gradient: 'linear-gradient(135deg, #00bcd4 0%, #2196f3 100%)',
    sidebarGradient: 'linear-gradient(135deg, #00bcd4 0%, #2196f3 100%)',
    buttonGradient: 'linear-gradient(135deg, #00bcd4 0%, #2196f3 100%)',
  },
  {
    id: 'amber-orange',
    name: 'Âmbar & Laranja',
    primary: '#ffc107',
    secondary: '#ff9800',
    gradient: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
    sidebarGradient: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
    buttonGradient: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
  },
  {
    id: 'indigo-purple',
    name: 'Índigo & Roxo',
    primary: '#3f51b5',
    secondary: '#673ab7',
    gradient: 'linear-gradient(135deg, #3f51b5 0%, #673ab7 100%)',
    sidebarGradient: 'linear-gradient(135deg, #3f51b5 0%, #673ab7 100%)',
    buttonGradient: 'linear-gradient(135deg, #3f51b5 0%, #673ab7 100%)',
  },
  {
    id: 'teal-green',
    name: 'Verde-azulado & Verde',
    primary: '#009688',
    secondary: '#4caf50',
    gradient: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)',
    sidebarGradient: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)',
    buttonGradient: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)',
  },
  {
    id: 'dark-gold',
    name: 'Escuro Dourado',
    primary: '#FFC700',
    secondary: '#E6B300',
    gradient: 'linear-gradient(135deg, #FFC700 0%, #E6B300 100%)',
    sidebarGradient: '#191919',
    buttonGradient: '#FFC700',
  },
];

export const getColorTheme = (themeId: string): ColorTheme => {
  return colorThemes.find(theme => theme.id === themeId) || colorThemes[0];
};
