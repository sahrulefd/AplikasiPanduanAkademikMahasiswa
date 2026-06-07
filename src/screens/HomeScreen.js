// src/screens/HomeScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import COURSES_DATA from '../data/courses';
import CourseCard from '../components/CourseCard';

const HomeScreen = ({ navigation, route }) => {
  // Menangkap data jika ada callback setelah mendaftar matakuliah
  const registeredCourse = route.params?.registeredCourse;

  // Bersihkan notifikasi setelah 3 detik
  useEffect(() => {
    if (registeredCourse) {
      const timer = setTimeout(() => {
        navigation.setParams({ registeredCourse: undefined });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registeredCourse, navigation]);

  const handlePressCourse = (course) => {
    navigation.navigate('CourseDetail', { course });
  };

  const renderHeader = () => (
    <View>
      {/* Banner Selamat Datang Premium */}
      <View style={styles.welcomeBanner}>
        <View style={styles.bannerOverlay} />
        <Text style={styles.greetingText}>Selamat Datang</Text>
        <Text style={styles.studentName}>Sahrul Efendi</Text>
        <View style={styles.npmContainer}>
          <Text style={styles.studentNpm}>NPM 233510312</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.studentStatus}>Mahasiswa Aktif</Text>
        </View>
      </View>

      {/* Notifikasi Pop-up Halus Jika Berhasil Daftar */}
      {registeredCourse && (
        <View style={styles.alertSuccess}>
          <Text style={styles.alertText}>
            🎉 Terdaftar di: <Text style={{ fontWeight: '700' }}>{registeredCourse}</Text>
          </Text>
        </View>
      )}

      {/* Grid Menu Cepat Modern */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Layanan Akademik</Text>
        <Text style={styles.sectionSubtitle}>Akses cepat menu perkuliahan</Text>
      </View>
      
      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => {}}>
          <View style={[styles.iconWrapper, { backgroundColor: '#E8DEF8' }]}>
            <Text style={styles.menuIcon}>📝</Text>
          </View>
          <Text style={styles.menuLabel}>KRS Online</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => {}}>
          <View style={[styles.iconWrapper, { backgroundColor: '#D0E1FD' }]}>
            <Text style={styles.menuIcon}>📊</Text>
          </View>
          <Text style={styles.menuLabel}>KHS & Nilai</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => {}}>
          <View style={[styles.iconWrapper, { backgroundColor: '#FFE0B2' }]}>
            <Text style={styles.menuIcon}>🏢</Text>
          </View>
          <Text style={styles.menuLabel}>Fakultas</Text>
        </TouchableOpacity>
      </View>

      {/* Judul List Mata Kuliah */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Jadwal Mata Kuliah</Text>
        <Text style={styles.sectionSubtitle}>Daftar kelas yang kamu ikuti semester ini</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F7F2FA" barStyle="dark-content" />
      
      <FlatList
        data={COURSES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard 
            course={item} 
            onPress={() => handlePressCourse(item)} 
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2FA', // MD3 Surface Container Low (Lebih bersih & smooth)
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  welcomeBanner: {
    backgroundColor: '#6750A4', // MD3 Primary
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerOverlay: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  greetingText: {
    fontSize: 13,
    color: '#EADDFF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  npmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  studentNpm: {
    fontSize: 13,
    color: '#EADDFF',
    fontWeight: '600',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EADDFF',
    marginHorizontal: 8,
    opacity: 0.6,
  },
  studentStatus: {
    fontSize: 12,
    color: '#EADDFF',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
  },
  alertSuccess: {
    backgroundColor: '#D1E7DD',
    borderColor: '#A3CFBB',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  alertText: {
    color: '#0F5132',
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D1B20',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#79747E',
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#49454F',
  },
});

export default HomeScreen;