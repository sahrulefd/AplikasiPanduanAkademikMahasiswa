import React from 'react';
import { View, StyleSheet, Linking, Share, Alert } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';

export default function DetailMatkulScreen({ route, navigation }) {
  // Mengambil data matkul dinamis yang dioper dari halaman Beranda
  // Menggunakan fallback jika data belum terlempar agar tidak crash
  const matkul = route.params?.matkul || {
    kode: 'TI-23351',
    nama: 'Pemrograman Mobile',
    sks: 3,
    semester: 4,
    dosen: 'ramdan, M.Kom.',
    ruangan: 'Gedung Fakultas Teknik UIR, Ruang 302',
    email: 'ramdan@eng.uir.ac.id',
  };

  // 1. Implicit Intent: Panggilan Telepon Langsung (Sesuai fungsi asli aplikasi kamu)
  const handleHubungiDosen = () => {
    const nomorDosen = '081234567890'; // Sesuaikan dengan nomor asli jika ada
    Linking.openURL(`tel:${nomorDosen}`);
  };

  // 2. Implicit Intent: Kirim Email Client
  const handleKirimEmail = () => {
    Linking.openURL(`mailto:${matkul.email}?subject=Konsultasi Kuliah: ${matkul.nama}`);
  };

  // 3. Implicit Intent: Buka Google Maps Lokasi Kampus
  const handleLihatMaps = () => {
    Linking.openURL(`geo:-0.4998,101.4496?q=Fakultas+Teknik+UIR`);
  };

  // 4. Implicit Intent: Share Konten ke Media Sosial
  const handleShareKelas = async () => {
    try {
      await Share.share({
        message: `Yuk belajar mata kuliah ${matkul.nama} bersama ${matkul.dosen} di ${matkul.ruangan}!`,
      });
    } catch (error) {
      Alert.alert("Error", "Gagal membagikan kelas.");
    }
  };

  // 5. Fitur Navigasi Balik + Mengirim Data (Sesuai Gambar Screenshot Notifikasi Pendaftaran)
  const handleDaftarKelas = () => {
    Alert.alert(
      "Pendaftaran Berhasil",
      `Anda telah berhasil mendaftar pada mata kuliah ${matkul.nama}.`,
      [
        {
          text: "OK",
          onPress: () => {
            // Sederhana dan langsung kembali ke Beranda (Anti-Multiple Instance)
            navigation.navigate('Beranda', { selectedMatkul: matkul.nama });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Kartu Header Mata Kuliah */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="labelMedium" style={styles.codeText}>{matkul.kode}</Text>
          <Text variant="headlineMedium" style={styles.titleText}>{matkul.nama}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{matkul.sks} SKS</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>Semester {matkul.semester}</Text></View>
          </View>
        </Card.Content>
      </Card>

      {/* Bagian Deskripsi */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Tentang Mata Kuliah</Text>
          <Text variant="bodyMedium" style={styles.bodyText}>
            Mata kuliah ini membahas mengenai pengembangan aplikasi perangkat bergerak menggunakan React Native dengan fokus pada komponen navigasi, state management, dan integrasi dengan API atau native features.
          </Text>
        </Card.Content>
      </Card>

      {/* Bagian Informasi Kelas */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Informasi Kelas</Text>
          
          <View style={styles.rowItem}>
            <Avatar.Icon size={36} icon="account" style={styles.iconAvatar} />
            <View>
              <Text variant="bodySmall" style={styles.labelSub}>Dosen Pengampu</Text>
              <Text variant="bodyLarge" style={styles.valueSub}>{matkul.dosen}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <Avatar.Icon size={36} icon="map-marker" style={styles.iconAvatar} />
            <View style={styles.infoTextContainer}>
              <Text variant="bodySmall" style={styles.labelSub}>Lokasi Ruangan</Text>
              <Text variant="bodyLarge" style={styles.valueSub} numberOfLines={2}>{matkul.ruangan}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Grid Tombol Aksi (Implicit Intent) */}
      <Text variant="titleMedium" style={styles.intentTitle}>Hubungan & Aksi (Implicit Intent)</Text>
      <View style={styles.gridContainer}>
        <Button mode="contained-tonal" icon="phone" style={styles.gridButton} onPress={handleHubungiDosen}>
          Hubungi Dosen
        </Button>
        <Button mode="contained-tonal" icon="email" style={styles.gridButton} onPress={handleKirimEmail}>
          Kirim Email
        </Button>
        <Button mode="contained-tonal" icon="map" style={styles.gridButton} onPress={handleLihatMaps}>
          Lihat di Maps
        </Button>
        <Button mode="contained-tonal" icon="share-variant" style={styles.gridButton} onPress={handleShareKelas}>
          Bagikan Kelas
        </Button>
      </View>

      {/* Tombol Utama Daftar */}
      <Button mode="contained" style={styles.submitButton} labelStyle={styles.submitLabel} onPress={handleDaftarKelas}>
        Daftar Kelas Sekarang
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8FC', padding: 16 },
  headerCard: { backgroundColor: '#6750A4', borderRadius: 24, marginBottom: 16 },
  codeText: { color: '#EADDFF', fontWeight: 'bold' },
  titleText: { color: '#FFFFFF', fontWeight: 'bold', marginVertical: 8 },
  badgeRow: { flexDirection: 'row', marginTop: 4 },
  badge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontWeight: 'bold', color: '#1C1B1F', marginBottom: 8 },
  bodyText: { color: '#49454F', lineHeight: 20 },
  rowItem: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  iconAvatar: { backgroundColor: '#E8DEF8', marginRight: 12 },
  infoTextContainer: { flex: 1, paddingRight: 4 },
  labelSub: { color: 'gray' },
  valueSub: { fontWeight: 'bold', color: '#1C1B1F' },
  intentTitle: { fontWeight: 'bold', color: '#1C1B1F', marginBottom: 12, marginTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridButton: { width: '48%', marginBottom: 12, borderRadius: 16, justifyContent: 'center' },
  submitButton: { backgroundColor: '#6750A4', paddingVertical: 6, borderRadius: 24, marginTop: 'auto', marginBottom: 10 },
  submitLabel: { fontSize: 16, fontWeight: 'bold' }
});