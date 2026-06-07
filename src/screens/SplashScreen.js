// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Timer selama 2000 milidetik (2 detik)
    const timer = setTimeout(() => {
      // replace digunakan agar user tidak bisa menekan tombol back kembali ke Splash Screen
      navigation.replace('MainTabs'); 
    }, 2000);

    // Membersihkan timer saat komponen di-unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Mengatur warna status bar atas agar senada dengan tema MD3 */}
      <StatusBar backgroundColor="#6750A4" barStyle="light-content" />
      
      <View style={styles.logoContainer}>
        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconText}>📖</Text>
        </View>
        <Text style={styles.title}>Panduan Academic</Text>
        <Text style={styles.subtitle}>Mahasiswa Universitas</Text>
      </View>
      
      {/* Bagian Footer: Ditambahkan identitas namamu */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#EADDFF" style={{ marginBottom: 12 }} />
        <Text style={styles.authorText}>by Sahrul Efendi</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6750A4', // MD3 Primary Color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#EADDFF', // MD3 Primary Container
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#EADDFF',
    marginTop: 4,
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
    color: '#EADDFF',
    marginTop: 4,
    opacity: 0.6,
  },
});

export default SplashScreen;