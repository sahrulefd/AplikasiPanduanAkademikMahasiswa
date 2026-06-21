import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppContext } from '../context/AppContext';

// PERBAIKAN: Impor disesuaikan dengan jenis export masing-masing file screen
import { HomeScreen } from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen'; // Tetap tanpa {} karena export default
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen'; 

import { Home, BookOpen, User, Settings } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const context = useContext(AppContext);
  const isDarkMode = context?.isDarkMode || false;
  
  // 1. Ambil state data mahasiswa untuk mendeteksi bahasa aktif dari context global
  const mahasiswa = (context as any)?.mahasiswa;
  const currentLanguage = mahasiswa?.language || 'id';

  // 2. Kamus Istilah Navigasi untuk Label Tab & Judul Header Atas
  const textContent = {
    id: {
      tabHome: 'Beranda',
      tabCourses: 'Mata Kuliah',
      tabProfile: 'Profil Saya',
      tabSettings: 'Pengaturan'
    },
    en: {
      tabHome: 'Home',
      tabCourses: 'Courses',
      tabProfile: 'My Profile',
      tabSettings: 'Settings'
    }
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Render Ikon Premium Menggunakan Lucide Icons secara Dinamis
        tabBarIcon: ({ color }) => {
          const iconSize = 20;
          if (route.name === 'Home') {
            return <Home color={color} size={iconSize} />;
          } else if (route.name === 'Courses') {
            return <BookOpen color={color} size={iconSize} />;
          } else if (route.name === 'Profile') {
            return <User color={color} size={iconSize} />;
          } else if (route.name === 'Settings') {
            return <Settings color={color} size={iconSize} />;
          }
          return null;
        },
        // Pewarnaan State Navigasi Bawah Modern Indigo & Slate
        tabBarActiveTintColor: isDarkMode ? '#A5B4FC' : '#4F46E5',     
        tabBarInactiveTintColor: isDarkMode ? '#64748B' : '#94A3B8',   
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',         
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#334155' : '#E2E8F0', 
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        // Sinkronisasi Gaya Visual Header Atas Masing-Masing Tab
        headerStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', 
          elevation: 0,              
          shadowOpacity: 0,          
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#334155' : '#E2E8F0',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',          
          color: isDarkMode ? '#F8FAFC' : '#1E293B',
          letterSpacing: 0.3,
        },
        headerTitleAlign: 'center',     
      })}
    >
      {/* 3. SINKRONISASI DINAMIS: Opsi title sekarang membaca nilai dari variabel kamus bahasa 't' */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t.tabHome }} 
      />
      
      <Tab.Screen 
        name="Courses" 
        component={CoursesScreen} 
        options={{ title: t.tabCourses }} 
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: t.tabProfile }} 
      />

      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: t.tabSettings }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;