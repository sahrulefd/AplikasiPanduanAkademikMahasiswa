// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import BottomTabs from './BottomTabs';
import CourseDetailScreen from '../screens/CourseDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FEF7FF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: '#1D1B20',
        },
        headerTintColor: '#6750A4', // Warna tombol back panah sesuai MD3 Primary
      }}
    >
      {/* 1. Halaman Splash Screen */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
        options={{ headerShown: false }} // Menyembunyikan header saat splash screen
      />

      {/* 2. Halaman Utama yang membungkus Bottom Tabs */}
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabs} 
        options={{ headerShown: false }} // Navigasi bawah sudah punya headernya sendiri
      />

      {/* 3. Halaman Detail Mata Kuliah */}
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={{ title: 'Detail Mata Kuliah' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;