// src/screens/CourseDetailScreen.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { openContact, openMap, sendEmail, shareCourse } from '../utils/intents';

const CourseDetailScreen = ({ route, navigation }) => {
  const { course } = route.params;

  const handleRegisterCourse = () => {
    Alert.alert(
      'Pendaftaran Berhasil',
      `Anda telah berhasil mendaftar pada mata kuliah ${course.name}.`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MainTabs', {
              screen: 'Home',
              params: { registeredCourse: course.name },
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor="#6750A4" barStyle="light-content" />
      
      {/* Header Banner Premium */}
      <View style={styles.headerCard}>
        <Text style={styles.courseCode}>{course.code}</Text>
        <Text style={styles.courseName}>{course.name}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}> {course.sks} SKS</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}>Semester {course.semester}</Text>
          </View>
        </View>
      </View>

      {/* Konten Deskripsi */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Tentang Mata Kuliah</Text>
        <Text style={styles.descriptionText}>{course.description}</Text>
      </View>

      {/* Konten Informasi Kelas */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Informasi Kelas</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👤</Text>
          <View>
            <Text style={styles.infoLabel}>Dosen Pengampu</Text>
            <Text style={styles.infoValue}>{course.lecturer}</Text>
          </View>
        </View>
        <View style={[styles.infoRow, { marginBottom: 0, marginTop: 12 }]}>
          <Text style={styles.infoIcon}>📍</Text>
          <View>
            <Text style={styles.infoLabel}>Lokasi Ruangan</Text>
            <Text style={styles.infoValue}>{course.location}</Text>
          </View>
        </View>
      </View>

      {/* Grid Tombol Aksi / Intent */}
      <Text style={styles.intentGridTitle}>Hubungan & Aksi (Implicit Intent)</Text>
      
      <View style={styles.intentGrid}>
        <TouchableOpacity 
          style={[styles.intentButton, { backgroundColor: '#E8DEF8' }]} 
          onPress={() => openContact(course.phone, `Halo Bapak/Ibu ${course.lecturer}, saya ingin bertanya terkait mata kuliah ${course.name}.`)}
          activeOpacity={0.7}
        >
          <View style={styles.intentIconCircle}>
            <Text style={styles.intentIcon}>💬</Text>
          </View>
          <Text style={styles.intentLabel}>Hubungi Dosen</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.intentButton, { backgroundColor: '#D0E1FD' }]} 
          onPress={() => sendEmail(course.email, `Tanya Matakuliah ${course.code}`, 'Halo Dosen Pengampu,\n\n')}
          activeOpacity={0.7}
        >
          <View style={[styles.intentIconCircle, { backgroundColor: '#B4D1FA' }]}>
            <Text style={styles.intentIcon}>✉️</Text>
          </View>
          <Text style={styles.intentLabel}>Kirim Email</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.intentButton, { backgroundColor: '#FFE0B2' }]} 
          onPress={() => openMap(course.location)}
          activeOpacity={0.7}
        >
          <View style={[styles.intentIconCircle, { backgroundColor: '#FFCC80' }]}>
            <Text style={styles.intentIcon}>🗺️</Text>
          </View>
          <Text style={styles.intentLabel}>Lihat di Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.intentButton, { backgroundColor: '#F4EFF4' }]} 
          onPress={() => shareCourse(course.name, course.lecturer)}
          activeOpacity={0.7}
        >
          <View style={[styles.intentIconCircle, { backgroundColor: '#E1DCE1' }]}>
            <Text style={styles.intentIcon}>🔗</Text>
          </View>
          <Text style={styles.intentLabel}>Bagikan Kelas</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Utama Registrasi */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegisterCourse} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>Daftar Kelas Sekarang</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2FA',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#6750A4',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  courseCode: {
    fontSize: 12,
    color: '#EADDFF',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  courseName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 30,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D1B20',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#49454F',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    backgroundColor: '#F4EFF4',
    padding: 8,
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: '#79747E',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D1B20',
    marginTop: 1,
  },
  intentGridTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D1B20',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  intentButton: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  intentIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D0BCFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  intentIcon: {
    fontSize: 18,
  },
  intentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D1B20',
  },
  primaryButton: {
    backgroundColor: '#6750A4',
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CourseDetailScreen;