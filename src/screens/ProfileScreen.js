// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FEF7FF" barStyle="dark-content" />
      
      {/* Avatar / Foto Profil */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>SE</Text>
        </View>
        <Text style={styles.profileName}>Sahrul Efendi</Text>
        <Text style={styles.profileMajor}>Teknik Informatika</Text>
      </View>

      {/* Detail Informasi Mahasiswa */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NPM</Text>
          <Text style={styles.infoValue}>233510312</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Universitas</Text>
          <Text style={styles.infoValue}>Universitas Islam Riau</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValueStatus}>Aktif</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Angkatan</Text>
          <Text style={styles.infoValue}>2023</Text>
        </View>
      </View>

      {/* Tombol Logout (Variasi MD3 Outlined Button) */}
      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={() => {}}>
        <Text style={styles.logoutButtonText}>Keluar Akun</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7FF', // MD3 Background
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    backgroundColor: '#6750A4', // MD3 Primary
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1B20',
  },
  profileMajor: {
    fontSize: 14,
    color: '#49454F',
    marginTop: 4,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F7F2FA', // MD3 Surface Container
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 1,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CAC4D0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#49454F',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1D1B20',
    fontWeight: '600',
  },
  infoValueStatus: {
    fontSize: 14,
    color: '#11823B',
    fontWeight: '700',
  },
  logoutButton: {
    width: '100%',
    borderColor: '#B3261E', // MD3 Error Color
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#B3261E',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;