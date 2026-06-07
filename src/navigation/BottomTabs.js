// src/navigation/BottomTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Menyesuaikan ikon berdasarkan home dan user
        tabBarIcon: ({ focused }) => {
          const displayIcon = route.name === 'Home' ? '⌂' : '👤';
          
          return (
            <Text 
              style={{ 
                fontSize: route.name === 'Home' ? 28 : 22, 
                color: focused ? '#6750A4' : '#79747E', 
                lineHeight: route.name === 'Home' ? 28 : 24,
                fontWeight: route.name === 'Profile' && !focused ? '300' : '700' // Memberikan efek outline/lebih tipis saat tidak aktif sesuai user.png
              }}
            >
              {displayIcon}
            </Text>
          );
        },
        tabBarActiveTintColor: '#6750A4',     
        tabBarInactiveTintColor: '#79747E',   
        tabBarStyle: {
          backgroundColor: '#F7F2FA',         
          borderTopWidth: 0.5,
          borderTopColor: '#E6E1E5', 
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: '#F7F2FA', 
          elevation: 0,               
          shadowOpacity: 0,           
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '800',          
          color: '#1D1B20',
          letterSpacing: 0.5,
        },
        headerTitleAlign: 'left',     
        headerContainerStyle: {
          paddingLeft: 8,             
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Beranda' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil Saya' }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;