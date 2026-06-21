// ============================================================
// APP.tsx — Entry Point (Enhanced with Background & Notification Init)
// ============================================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';
import BottomTabs from './src/navigation/BottomTabs';
import { CourseDetailScreen } from './src/screens/CourseDetailScreen';

// 💡 1. IMPOR SPLASH SCREEN
import SplashScreen from './src/screens/SplashScreen';

// 🔔 2. IMPOR SERVICES (Background & Notification)
import { requestNotificationPermission } from './src/services/notificationService';
import { registerBackgroundFetch, getBackgroundFetchStatus } from './src/services/backgroundService';

const Stack = createNativeStackNavigator();

export default function App() {
  // 🚀 3. INISIALISASI SERVICES SAAT APP STARTUP
  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      // Request notification permission
      console.log('[App] Requesting notification permission...');
      await requestNotificationPermission();

      // Check & register background fetch if previously enabled
      console.log('[App] Checking background fetch status...');
      const bgStatus = await getBackgroundFetchStatus();
      
      if (bgStatus.isEnabled && !bgStatus.isRegistered) {
        console.log('[App] Re-registering background fetch...');
        await registerBackgroundFetch();
      }

      console.log('[App] Services initialized successfully');
    } catch (error) {
      console.error('[App] Error initializing services:', error);
    }
  };

  return (
    <AppProvider>
      <NavigationContainer>
        {/* 2. INITIAL ROUTE NAME: Rute awal mengarah ke "Splash" */}
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerTitleStyle: { fontWeight: '600' } }}
        >
          {/* Screen Splash */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          {/* Menu Utama (Bottom Tabs) */}
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />

          {/* Detail Mata Kuliah */}
          <Stack.Screen
            name="DetailMatkulScreen"
            component={CourseDetailScreen}
            options={{ title: 'Detail Kelas' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}