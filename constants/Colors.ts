/**
 * App color theme constants
 * Dark mode: Monochromatic black & white with subtle grays
 * Light mode: Simple, clean default colors
 */

const white = '#FFFFFF';
const black = '#000000';
const gray = {
  100: '#F5F5F5',
  200: '#EEEEEE',
  300: '#E0E0E0',
  400: '#BDBDBD',
  500: '#9E9E9E',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

export const Colors = {
  light: {
    text: gray[900],
    background: white,
    surface: gray[100],
    tint: gray[700],
    accent: gray[600],
    accentAlpha: 'rgba(97, 97, 97, 0.4)',
    icon: gray[700],
    tabIconDefault: gray[400],
    tabIconSelected: gray[900],
    buttonBackground: gray[800],
    cardBackground: white,
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    text: white,
    background: black,
    surface: gray[900],
    tint: white,
    accent: white,
    accentAlpha: 'rgba(255, 255, 255, 0.4)',
    icon: white,
    tabIconDefault: gray[600],
    tabIconSelected: white,
    buttonBackground: white,
    cardBackground: gray[900],
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(255, 255, 255, 0.1)',
  },
  gradients: {
    dark: {
      primary: [black, gray[900]],
      accent: [gray[800], black],
    },
    light: {
      primary: [white, gray[100]],
      accent: [gray[200], gray[300]],
    }
  }
};
