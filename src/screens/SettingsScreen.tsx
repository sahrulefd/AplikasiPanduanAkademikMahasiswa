// ============================================================
// SETTINGS SCREEN — Pengaturan (Enhanced with Background Sync & Notifications)
// ============================================================

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Linking, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { Moon, Sun, Bell, ShieldAlert, Info, Languages, ExternalLink, RefreshCw, Cloud, CloudOff, Cpu } from 'lucide-react-native';
import { registerBackgroundFetch, unregisterBackgroundFetch, getBackgroundFetchStatus } from '../services/backgroundService';
import { requestNotificationPermission, sendDeadlineNotification } from '../services/notificationService';

export const SettingsScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return (
      <View style={styles.container}>
        <Text>Memuat Pengaturan...</Text>
      </View>
    );
  }

  const {
    isDarkMode, toggleTheme, clearAllData, mahasiswa, updateMahasiswa,
    isOnline, isSyncing, lastSyncTime, syncFromServer,
    bgSyncEnabled, setBgSyncEnabled,
  } = context as any;

  const [notifEnabled, setNotifEnabled] = useState<boolean>(true);
  const [bgTaskStatus, setBgTaskStatus] = useState<string>('');
  const [isSyncingManual, setIsSyncingManual] = useState(false);

  // Baca bahasa aktif dari global context mahasiswa
  const currentLanguage = mahasiswa?.language || 'id';

  // Cek status background task saat mount
  useEffect(() => {
    checkBgStatus();
    loadNotifSetting();
  }, [bgSyncEnabled]);

  const loadNotifSetting = async () => {
    try {
      const saved = await AsyncStorage.getItem('@notifications_enabled');
      if (saved !== null) {
        setNotifEnabled(saved === 'true');
      } else {
        setNotifEnabled(true);
      }
    } catch (error) {
      console.error('Error loading notification setting:', error);
    }
  };

  const checkBgStatus = async () => {
    const status = await getBackgroundFetchStatus();
    setBgTaskStatus(status.status);
  };

  // Format waktu sync terakhir
  const formatSyncTime = (isoString: string | null) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ', ' + date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '-';
    }
  };

  const textContent = {
    id: {
      title: 'Pengaturan',
      subtitle: 'Kelola preferensi, notifikasi, sinkronisasi, dan tema aplikasi',
      darkMode: 'Mode Gelap (Dark Mode)',
      notif: 'Notifikasi Akademik',
      bgSync: 'Background Sync (Auto)',
      bgSyncSub: 'Sinkronisasi otomatis setiap 30 menit',
      langMenu: 'Bahasa Aplikasi / Language',
      langName: 'Indonesia',
      visitUir: 'Kunjungi Website UIR',
      resetData: 'Reset Semua Data Kuliah',
      syncNow: 'Sinkronisasi Sekarang',
      syncing: 'Menyinkronkan...',
      lastSync: 'Sync terakhir:',
      connection: 'Status Koneksi',
      online: 'Online — Terhubung ke internet',
      offline: 'Offline — Tidak ada koneksi',
      bgStatus: 'Status:',
      alertLangTitle: 'Pilih Bahasa',
      alertLangSub: 'Silakan pilih bahasa aplikasi:',
      alertResetTitle: 'Reset Aplikasi',
      alertResetSub: 'Apakah Anda yakin ingin menghapus semua data mata kuliah?',
      alertResetSuccess: 'Semua data berhasil dibersihkan!',
      cancel: 'Batal',
      footerApp: 'Panduan Akademik Mahasiswa — Pemrograman Mobile',
      testNotif: 'Test Notifikasi',
    },
    en: {
      title: 'Settings',
      subtitle: 'Manage preferences, notifications, sync, and app theme',
      darkMode: 'Dark Mode',
      notif: 'Academic Notifications',
      bgSync: 'Background Sync (Auto)',
      bgSyncSub: 'Auto-sync every 30 minutes',
      langMenu: 'Application Language / Bahasa',
      langName: 'English',
      visitUir: 'Visit UIR Website',
      resetData: 'Reset All Course Data',
      syncNow: 'Sync Now',
      syncing: 'Syncing...',
      lastSync: 'Last sync:',
      connection: 'Connection Status',
      online: 'Online — Connected to internet',
      offline: 'Offline — No connection',
      bgStatus: 'Status:',
      alertLangTitle: 'Select Language',
      alertLangSub: 'Please select application language:',
      alertResetTitle: 'Reset Application',
      alertResetSub: 'Are you sure you want to delete all course data?',
      alertResetSuccess: 'All data has been cleared successfully!',
      cancel: 'Cancel',
      footerApp: 'Student Academic Guide — Mobile Programming',
      testNotif: 'Test Notification',
    },
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  const handleToggle = () => {
    if (typeof toggleTheme === 'function') {
      toggleTheme();
    }
  };

  // Notification Toggle
  const handleNotifToggle = async (value: boolean) => {
    setNotifEnabled(value);
    try {
      await AsyncStorage.setItem('@notifications_enabled', String(value));
      if (value) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          setNotifEnabled(false);
          await AsyncStorage.setItem('@notifications_enabled', 'false');
          Alert.alert('Error', 'Izin notifikasi ditolak / Notification permission denied');
        }
      }
    } catch (error) {
      console.error('Error saving notification preference:', error);
    }
  };

  // Background Sync Toggle
  const handleBgSyncToggle = async (value: boolean) => {
    try {
      if (value) {
        const registered = await registerBackgroundFetch();
        if (registered) {
          await setBgSyncEnabled(true);
        } else {
          Alert.alert('Info', 'Background fetch tidak tersedia di perangkat ini. Fitur ini memerlukan development build.');
        }
      } else {
        await unregisterBackgroundFetch();
        await setBgSyncEnabled(false);
      }
      await checkBgStatus();
    } catch (error) {
      console.error('Error toggling background sync:', error);
    }
  };

  // Manual Sync
  const handleManualSync = async () => {
    setIsSyncingManual(true);
    try {
      await syncFromServer();
    } finally {
      setIsSyncingManual(false);
    }
  };

  // Test Notification
  const handleTestNotification = async () => {
    console.log('[Test Notif] Clicked. Local state notifEnabled:', notifEnabled);
    if (!notifEnabled) {
      Alert.alert(
        currentLanguage === 'id' ? 'Notifikasi Dimatikan' : 'Notifications Disabled',
        currentLanguage === 'id'
          ? 'Aktifkan sakelar "Notifikasi Akademik" terlebih dahulu untuk menguji.'
          : 'Enable the "Academic Notifications" switch first to test.'
      );
      return;
    }
    await requestNotificationPermission();
    await sendDeadlineNotification('Pemrograman Mobile');
  };

  // Language Change
  const handleLanguageChange = () => {
    Alert.alert(
      t.alertLangTitle,
      t.alertLangSub,
      [
        {
          text: `Bahasa Indonesia ${currentLanguage === 'id' ? '✓' : ''}`,
          onPress: () => {
            updateMahasiswa({ ...mahasiswa, language: 'id' });
          },
        },
        {
          text: `English ${currentLanguage === 'en' ? '✓' : ''}`,
          onPress: () => {
            updateMahasiswa({ ...mahasiswa, language: 'en' });
          },
        },
        { text: t.cancel, style: 'cancel' },
      ]
    );
  };

  const handleOpenLink = () => {
    const url = 'https://uir.ac.id';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
    });
  };

  const handleResetData = () => {
    Alert.alert(
      t.alertResetTitle,
      t.alertResetSub,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            if (typeof clearAllData === 'function') {
              clearAllData();
              Alert.alert('Sukses / Success', t.alertResetSuccess);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.scrollView, isDarkMode ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.scrollContent}>

      <View style={styles.headerSection}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>
          {t.title}
        </Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
          {t.subtitle}
        </Text>
      </View>

      {/* Connection Status */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight,
        isOnline ? (isDarkMode ? styles.connectionOnlineDark : styles.connectionOnlineLight) : (isDarkMode ? styles.connectionOfflineDark : styles.connectionOfflineLight)
      ]}>
        <View style={styles.menuRow}>
          <View style={styles.menuLeft}>
            {isOnline
              ? <Cloud color={isDarkMode ? '#34D399' : '#059669'} size={20} />
              : <CloudOff color={isDarkMode ? '#F87171' : '#DC2626'} size={20} />
            }
            <View>
              <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
                {t.connection}
              </Text>
              <Text style={[styles.menuSubText, isOnline
                ? { color: isDarkMode ? '#34D399' : '#059669' }
                : { color: isDarkMode ? '#F87171' : '#DC2626' }
              ]}>
                {isOnline ? t.online : t.offline}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <View style={styles.menuRow}>
          <View style={styles.menuLeft}>
            {isDarkMode ? <Moon color="#A5B4FC" size={20} /> : <Sun color="#EA580C" size={20} />}
            <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.darkMode}
            </Text>
          </View>
          <Switch trackColor={{ false: '#CBD5E1', true: '#4F46E5' }} thumbColor={isDarkMode ? '#A5B4FC' : '#F1F5F9'} onValueChange={handleToggle} value={isDarkMode} />
        </View>
      </View>

      {/* Notification Toggle */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <View style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Bell color={isDarkMode ? '#6366F1' : '#4F46E5'} size={20} />
            <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.notif}
            </Text>
          </View>
          <Switch trackColor={{ false: '#CBD5E1', true: '#4F46E5' }} thumbColor={notifEnabled ? '#A5B4FC' : '#F1F5F9'} onValueChange={handleNotifToggle} value={notifEnabled} />
        </View>
      </View>

      {/* Background Sync Toggle */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <View style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Cpu color={isDarkMode ? '#FBBF24' : '#D97706'} size={20} />
            <View>
              <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
                {t.bgSync}
              </Text>
              <Text style={[styles.menuSubText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
                {t.bgSyncSub}
              </Text>
            </View>
          </View>
          <Switch trackColor={{ false: '#CBD5E1', true: '#4F46E5' }} thumbColor={bgSyncEnabled ? '#A5B4FC' : '#F1F5F9'} onValueChange={handleBgSyncToggle} value={bgSyncEnabled} />
        </View>
      </View>

      {/* Manual Sync Button */}
      <TouchableOpacity
        style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight,
          isSyncingManual && { opacity: 0.6 }]}
        onPress={handleManualSync}
        disabled={isSyncingManual}
        activeOpacity={0.7}
      >
        <View style={styles.menuRow}>
          <View style={styles.menuLeft}>
            {isSyncingManual
              ? <ActivityIndicator size="small" color={isDarkMode ? '#A5B4FC' : '#4F46E5'} />
              : <RefreshCw color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={20} />
            }
            <View>
              <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
                {isSyncingManual ? t.syncing : t.syncNow}
              </Text>
              <Text style={[styles.menuSubText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
                {t.lastSync} {formatSyncTime(lastSyncTime)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Test Notification */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <TouchableOpacity style={styles.menuRow} onPress={handleTestNotification} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <Bell color={isDarkMode ? '#F59E0B' : '#D97706'} size={20} />
            <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.testNotif}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Language */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <TouchableOpacity style={styles.menuRow} onPress={handleLanguageChange} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <Languages color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={20} />
            <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.langMenu}
            </Text>
          </View>
          <Text style={[styles.langStatus, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {t.langName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Visit UIR */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <TouchableOpacity style={styles.menuRow} onPress={handleOpenLink} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <ExternalLink color={isDarkMode ? '#34D399' : '#10B981'} size={20} />
            <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.visitUir}
            </Text>
          </View>
          <ExternalLink color={isDarkMode ? '#94A3B8' : '#64748B'} size={14} />
        </TouchableOpacity>
      </View>

      {/* Reset Data */}
      <View style={[styles.menuBox, isDarkMode ? styles.menuBoxDark : styles.menuBoxLight]}>
        <TouchableOpacity style={styles.menuRow} onPress={handleResetData} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <ShieldAlert color="#EF4444" size={20} />
            <Text style={[styles.menuText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.resetData}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footerSection}>
        <View style={styles.infoRow}>
          <Info color={isDarkMode ? '#64748B' : '#94A3B8'} size={14} />
          <Text style={[styles.footerText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {t.footerApp}
          </Text>
        </View>
        <Text style={[styles.teamText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
          Developed by sahrul efendi
        </Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }, // fallback/loading state
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  headerSection: { marginBottom: 20, marginTop: 6 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 18 },
  menuBox: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 10 },
  menuBoxLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  menuBoxDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  menuText: { fontSize: 14, fontWeight: '600' },
  menuSubText: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  langStatus: { fontSize: 13, fontWeight: '500' },

  // Connection status colors
  connectionOnlineLight: { borderColor: '#A7F3D0' },
  connectionOnlineDark: { borderColor: '#047857' },
  connectionOfflineLight: { borderColor: '#FECACA' },
  connectionOfflineDark: { borderColor: '#7F1D1D' },

  footerSection: { marginTop: 24, alignItems: 'center', marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  footerText: { fontSize: 12, fontWeight: '500' },
  teamText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  textLight: { color: '#1E293B' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
});

export default SettingsScreen;