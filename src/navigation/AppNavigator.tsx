import React, { useContext } from 'react';
// PERBAIKAN 1: Menggunakan createNativeStackNavigator sesuai dependencies package.json
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext } from '../context/AppContext';
import SplashScreen from '../screens/SplashScreen';
import BottomTabs from './BottomTabs';
// Menggunakan named import sesuai deklarasi ekspor di file DetailMatkulScreen
import { DetailMatkulScreen } from '../screens/DetailMatkulScreen';

// Definisikan daftar rute dan parameter untuk Type Safety TypeScript
export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  // Mengubah parameter agar menerima objek 'course' utuh supaya detail tidak kosong
  DetailMatkulScreen: { course: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // Ambil context secara utuh terlebih dahulu
  const context = useContext(AppContext);

  // (Property 'isDarkMode' does not exist)
  if (!context) {
    return null;
  }

  // Bongkar isDarkMode setelah divalidasi aman oleh TypeScript
  const { isDarkMode } = context;

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
        },
        // Pada native-stack, pewarnaan teks judul dan tombol back digabung lewat properti ini
        headerTintColor: isDarkMode ? '#A5B4FC' : '#4F46E5', 
        headerTitleAlign: 'center',
      }}
    >
      {/* 1. Halaman Splash Screen */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
      />

      {/* 2. Halaman Utama yang membungkus Bottom Tabs */}
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabs} 
        options={{ headerShown: false }} 
      />

      {/* 3. Halaman Detail Mata Kuliah */}
      <Stack.Screen 
        name="DetailMatkulScreen" 
        component={DetailMatkulScreen} 
        options={{ 
          title: 'Detail Kelas',
          // Menyamakan style garis bawah tipis untuk mode gelap/terang pada native-stack
          headerShadowVisible: true,
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;