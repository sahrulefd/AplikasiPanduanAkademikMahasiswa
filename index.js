import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

// Suppress known Expo Go limitations from popping up in the LogBox UI
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'MMKV native module not found',
  'expo-background-fetch: This library is deprecated',
  'Background Fetch functionality is not available in Expo Go',
]);

// Hook console.error to prevent the expo-notifications message from showing as a red error screen
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.map(arg => String(arg)).join(' ');
  if (
    message.includes('expo-notifications: Android Push') ||
    message.includes('remote notifications') ||
    message.includes('was removed from Expo Go')
  ) {
    // Redirect to console.warn so it is still logged in the terminal but doesn't pop up as a red screen
    console.warn('[Suppressed Remote Notif Error]:', ...args);
    return;
  }
  originalConsoleError(...args);
};

import App from './App';

registerRootComponent(App);