// ============================================================
// HOME SCREEN — Beranda (Enhanced with Connection Status & Pull-to-Refresh)
// ============================================================

import React, { useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import CourseCard from '../components/CourseCard';
import { AppContext } from '../context/AppContext';
import { FileText, BarChart2, School, CheckCircle, Cloud, CloudOff, RefreshCw } from 'lucide-react-native';

interface HomeScreenProps {
  navigation: any;
  route: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { mahasiswa, courses, isDarkMode, isOnline, isSyncing, lastSyncTime, syncFromServer } = context as any;
  const registeredCourse = route.params?.registeredCourse;
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  useEffect(() => {
    if (registeredCourse) {
      const timer = setTimeout(() => {
        navigation.setParams({ registeredCourse: undefined });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registeredCourse, navigation]);

  const handlePressCourse = (course: any) => {
    navigation.navigate('DetailMatkulScreen', { course: course });
  };

  // Pull-to-Refresh Handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await syncFromServer();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format waktu sync terakhir
  const formatSyncTime = (isoString: string | null) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ' ' + date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    } catch {
      return '-';
    }
  };

  // 1. Baca bahasa aktif dari global context mahasiswa (default: 'id')
  const currentLanguage = mahasiswa?.language || 'id';

  // 2. Kamus Terjemahan Halaman Beranda (Indonesia & English)
  const textContent = {
    id: {
      greeting: 'Selamat Datang',
      activeStatus: 'Mahasiswa Aktif',
      alertReg: 'Terdaftar di kelas:',
      layananTitle: 'Layanan Akademik',
      layananSub: 'Akses cepat menu perkuliahan',
      menuKrs: 'KRS Online',
      menuKhs: 'KHS & Nilai',
      menuFakultas: 'Fakultas',
      jadwalTitle: 'Jadwal Mata Kuliah',
      jadwalSub: 'Daftar kelas yang kamu ikuti semester ini',
      emptyText: 'Belum ada jadwal mata kuliah. Silakan tambah di menu Mata Kuliah.',
      online: 'Online',
      offline: 'Offline',
      lastSync: 'Sync terakhir:',
      pullHint: 'Tarik ke bawah untuk sinkronisasi',
    },
    en: {
      greeting: 'Welcome Back',
      activeStatus: 'Active Student',
      alertReg: 'Registered in class:',
      layananTitle: 'Academic Services',
      layananSub: 'Quick access to course menus',
      menuKrs: 'KRS Online',
      menuKhs: 'Grades & KHS',
      menuFakultas: 'Faculty',
      jadwalTitle: 'Course Schedule',
      jadwalSub: 'List of classes you are attending this semester',
      emptyText: 'No course schedule found. Please add ones in the Courses menu.',
      online: 'Online',
      offline: 'Offline',
      lastSync: 'Last sync:',
      pullHint: 'Pull down to sync',
    },
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  const renderHeader = () => (
    <View>
      {/* Banner Selamat Datang Premium */}
      <View style={[styles.welcomeBanner, isDarkMode ? styles.welcomeBannerDark : styles.welcomeBannerLight]}>
        <View style={styles.bannerOverlay} />
        <Text style={styles.greetingText}>{t.greeting}</Text>
        <Text style={styles.studentName}>{mahasiswa?.nama || 'Sahrul Efendi'}</Text>
        <View style={styles.npmContainer}>
          <Text style={styles.studentNpm}>NPM {mahasiswa?.nim || '233510312'}</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.studentStatus}>{t.activeStatus}</Text>
        </View>

        {/* Connection Status Badge di Banner */}
        <View style={styles.bannerConnectionRow}>
          <View style={[styles.connectionBadge, isOnline ? styles.connectionOnline : styles.connectionOffline]}>
            {isOnline
              ? <Cloud color="#FFFFFF" size={11} />
              : <CloudOff color="#FFFFFF" size={11} />
            }
            <Text style={styles.connectionBadgeText}>
              {isOnline ? t.online : t.offline}
            </Text>
          </View>
        </View>
      </View>

      {/* Notifikasi Pop-up Sukses */}
      {registeredCourse && (
        <View style={[styles.alertSuccess, isDarkMode ? styles.alertSuccessDark : styles.alertSuccessLight]}>
          <CheckCircle color={isDarkMode ? '#34D399' : '#0F5132'} size={18} />
          <Text style={[styles.alertText, isDarkMode ? styles.textDark : { color: '#0F5132' }]}>
            {t.alertReg} <Text style={{ fontWeight: '700' }}>{registeredCourse}</Text>
          </Text>
        </View>
      )}

      {/* Grid Menu Layanan Akademik */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>{t.layananTitle}</Text>
        <Text style={[styles.sectionSubtitle, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.layananSub}</Text>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={[styles.menuItem, isDarkMode ? styles.menuItemDark : styles.menuItemLight]} activeOpacity={0.7} onPress={() => {}}>
          <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EEF2F6' }]}>
            <FileText color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={22} />
          </View>
          <Text style={[styles.menuLabel, isDarkMode ? styles.textDark : styles.textLight]}>{t.menuKrs}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, isDarkMode ? styles.menuItemDark : styles.menuItemLight]} activeOpacity={0.7} onPress={() => {}}>
          <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5' }]}>
            <BarChart2 color={isDarkMode ? '#34D399' : '#10B981'} size={22} />
          </View>
          <Text style={[styles.menuLabel, isDarkMode ? styles.textDark : styles.textLight]}>{t.menuKhs}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, isDarkMode ? styles.menuItemDark : styles.menuItemLight]} activeOpacity={0.7} onPress={() => {}}>
          <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? '#7C2D12' : '#FFF7ED' }]}>
            <School color={isDarkMode ? '#FB923C' : '#EA580C'} size={22} />
          </View>
          <Text style={[styles.menuLabel, isDarkMode ? styles.textDark : styles.textLight]}>{t.menuFakultas}</Text>
        </TouchableOpacity>
      </View>

      {/* Judul Jadwal Kuliah + Last Sync */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>{t.jadwalTitle}</Text>
        <Text style={[styles.sectionSubtitle, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.jadwalSub}</Text>
        {lastSyncTime && (
          <View style={styles.lastSyncRow}>
            <RefreshCw color={isDarkMode ? '#64748B' : '#94A3B8'} size={11} />
            <Text style={[styles.lastSyncText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
              {t.lastSync} {formatSyncTime(lastSyncTime)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <StatusBar
        backgroundColor={isDarkMode ? '#0F172A' : '#F8FAFC'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard
            course={{ ...item, semester: mahasiswa?.semester || '6' }}
            onPress={() => handlePressCourse(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {t.emptyText}
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4F46E5']}
            tintColor={isDarkMode ? '#A5B4FC' : '#4F46E5'}
            progressBackgroundColor={isDarkMode ? '#1E293B' : '#FFFFFF'}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerLight: { backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  listContainer: { padding: 16, paddingBottom: 30 },

  welcomeBanner: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  welcomeBannerLight: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeBannerDark: {
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#3730A3',
  },
  bannerOverlay: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  greetingText: { fontSize: 11, color: '#C7D2FE', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  studentName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
  npmContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  studentNpm: { fontSize: 13, color: '#E0E7FF', fontWeight: '600' },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#C7D2FE', marginHorizontal: 8, opacity: 0.5 },
  studentStatus: { fontSize: 12, color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.16)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontWeight: '600' },

  // Connection Badge in Banner
  bannerConnectionRow: { marginTop: 12 },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  connectionOnline: { backgroundColor: 'rgba(16, 185, 129, 0.3)' },
  connectionOffline: { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
  connectionBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  alertSuccess: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, marginBottom: 24, borderWidth: 1 },
  alertSuccessLight: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  alertSuccessDark: { backgroundColor: '#064E3B', borderColor: '#047857' },
  alertText: { fontSize: 14, flex: 1 },

  sectionHeader: { marginBottom: 14, paddingHorizontal: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionSubtitle: { fontSize: 12, marginTop: 2 },

  // Last Sync Row
  lastSyncRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  lastSyncText: { fontSize: 11, fontWeight: '500' },

  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  menuItem: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1 },
  menuItemLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  iconWrapper: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  menuLabel: { fontSize: 13, fontWeight: '600' },

  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 14, fontWeight: '500', paddingHorizontal: 20, lineHeight: 20 },

  textLight: { color: '#1E293B' },
  textDark: { color: '#F8FAFC' },
  textLightMuted: { color: '#64748B' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
});

export default HomeScreen;