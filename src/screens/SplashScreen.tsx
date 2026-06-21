import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { GraduationCap } from 'lucide-react-native';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs'); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Mengatur warna status bar atas agar senada dengan warna latar belakang premium */}
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      
      <View style={styles.logoContainer}>
        <View style={styles.iconContainer}>
          <GraduationCap color="#4F46E5" size={42} />
        </View>
        <Text style={styles.title}>AppEdu Academic</Text>
        <Text style={styles.subtitle}>Aplikasi Panduan Akademik Mahasiswa</Text>
      </View>
      
      {/* Bagian Footer Identitas */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#EEF2F6" style={{ marginBottom: 14 }} />
        <Text style={styles.authorText}>by Sahrul Efendi</Text>
        <Text style={styles.versionText}>v2.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 84,
    height: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 6,
    fontWeight: '400',
  },
  footer: {
    marginBottom: 36,
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  versionText: {
    fontSize: 11,
    color: '#C7D2FE',
    marginTop: 4,
    opacity: 0.7,
  },
});

export default SplashScreen;