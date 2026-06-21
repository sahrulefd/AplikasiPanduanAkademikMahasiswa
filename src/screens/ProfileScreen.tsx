import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { User, Edit2, X, Award, BookOpen, CheckCircle, GraduationCap } from 'lucide-react-native';

export const ProfileScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { mahasiswa, updateMahasiswa, isDarkMode, courses } = context as any;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Ambil bahasa aktif dari objek mahasiswa di context global (default: 'id')
  const currentLanguage = mahasiswa?.language || 'id';

  // Kamus Terjemahan Halaman Profil
  const textContent = {
    id: {
      editBtn: 'Edit Profil',
      summaryTitle: 'Ringkasan Akademik',
      ipkLabel: 'IPK Berjalan',
      classLabel: 'Jadwal Aktif',
      classValue: 'Kelas',
      sppLabel: 'Status Keuangan (SPP)',
      sppStatus: 'LUNAS',
      prodiLabel: 'Fakultas / Prodi',
      prodiValue: 'FT / Teknik Informatika',
      modalTitle: 'Edit Profil Mahasiswa',
      labelNama: 'Nama Lengkap',
      labelNim: 'NPM / NIM',
      labelSem: 'Semester Saat Ini',
      btnCancel: 'Batal',
      btnSave: 'Simpan',
      alertError: 'Semua kolom data diri wajib diisi!',
      alertSuccess: 'Data profil berhasil diperbarui secara permanen!'
    },
    en: {
      editBtn: 'Edit Profile',
      summaryTitle: 'Academic Summary',
      ipkLabel: 'Current GPA',
      classLabel: 'Active Schedule',
      classValue: 'Classes',
      sppLabel: 'Financial Status (Tuition)',
      sppStatus: 'PAID',
      prodiLabel: 'Faculty / Major',
      prodiValue: 'Engineering / Informatics',
      modalTitle: 'Edit Student Profile',
      labelNama: 'Full Name',
      labelNim: 'Student ID / NPM',
      labelSem: 'Current Semester',
      btnCancel: 'Cancel',
      btnSave: 'Save',
      alertError: 'All personal data fields are required!',
      alertSuccess: 'Profile data has been permanently updated!'
    }
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  const [form, setForm] = useState({
    nama: mahasiswa?.nama || '',
    nim: mahasiswa?.nim || '',
    semester: mahasiswa?.semester || '',
  });

  useEffect(() => {
    if (mahasiswa) {
      setForm({
        nama: mahasiswa.nama,
        nim: mahasiswa.nim,
        semester: mahasiswa.semester,
      });
    }
  }, [mahasiswa]);

  const totalCoursesActive = courses ? courses.length : 0;

  const handleSaveProfile = () => {
    if (!form.nama || !form.nim || !form.semester) {
      Alert.alert('Error', t.alertError);
      return;
    }
    
    // Pertahankan data bahasa yang sedang aktif saat menyimpan profil
    updateMahasiswa({ ...form, language: currentLanguage });
    setModalVisible(false);
    Alert.alert('Sukses / Success', t.alertSuccess);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]} showsVerticalScrollIndicator={false}>
      
      {/* Card Profil Utama */}
      <View style={[styles.profileCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
        <View style={[styles.avatarCircle, isDarkMode ? styles.avatarCircleDark : styles.avatarCircleLight]}>
          <User color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={40} />
        </View>
        <Text style={[styles.profileName, isDarkMode ? styles.textDark : styles.textLight]}>
          {mahasiswa?.nama || 'Sahrul Efendi'}
        </Text>
        <Text style={[styles.profileNim, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
          NPM: {mahasiswa?.nim || '233510312'}
        </Text>
        <Text style={[styles.profileSemester, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
          Semester {mahasiswa?.semester || '6'} • Teknik Informatika
        </Text>

        <TouchableOpacity 
          style={[styles.btnEdit, isDarkMode ? styles.btnEditDark : styles.btnEditLight]} 
          onPress={() => {
            setForm({ 
              nama: mahasiswa?.nama || '', 
              nim: mahasiswa?.nim || '', 
              semester: mahasiswa?.semester || '' 
            });
            setModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <Edit2 color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={14} />
          <Text style={[styles.btnEditText, { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }]}>{t.editBtn}</Text>
        </TouchableOpacity>
      </View>

      {/* Section Ringkasan Akademik */}
      <View style={styles.sectionHeader}>
        <GraduationCap color={isDarkMode ? '#94A3B8' : '#64748B'} size={18} />
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>{t.summaryTitle}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statsCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <Award color={isDarkMode ? '#FBBF24' : '#D97706'} size={24} />
          <Text style={[styles.statsValue, isDarkMode ? styles.textDark : styles.textLight]}>3.85</Text>
          <Text style={[styles.statsLabel, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.ipkLabel}</Text>
        </View>

        <View style={[styles.statsCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <BookOpen color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={24} />
          <Text style={[styles.statsValue, isDarkMode ? styles.textDark : styles.textLight]}>{totalCoursesActive} {t.classValue}</Text>
          <Text style={[styles.statsLabel, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.classLabel}</Text>
        </View>
      </View>

      {/* Status Administrasi Kampus */}
      <View style={[styles.infoBox, isDarkMode ? styles.cardDark : styles.cardLight]}>
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <CheckCircle color="#10B981" size={18} />
            <Text style={[styles.infoText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.sppLabel}
            </Text>
          </View>
          <Text style={styles.statusBadge}>{t.sppStatus}</Text>
        </View>
        
        <View style={[styles.divider, isDarkMode ? styles.dividerDark : styles.dividerLight]} />
        
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <GraduationCap color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={18} />
            <Text style={[styles.infoText, isDarkMode ? styles.textDark : styles.textLight]}>
              {t.prodiLabel}
            </Text>
          </View>
          <Text style={[styles.infoSubText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {t.prodiValue}
          </Text>
        </View>
      </View>

      {/* Modal Form Edit Profil */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.modalContentDark : styles.modalContentLight]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode ? styles.textDark : styles.textLight]}>{t.modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.6}>
                <X color={isDarkMode ? '#94A3B8' : '#64748B'} size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.labelNama}</Text>
            <TextInput
              style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
              value={form.nama}
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              onChangeText={(text) => setForm({ ...form, nama: text })}
            />

            <Text style={[styles.inputLabel, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.labelNim}</Text>
            <TextInput
              style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
              keyboardType="numeric"
              value={form.nim}
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              onChangeText={(text) => setForm({ ...form, nim: text })}
            />

            <Text style={[styles.inputLabel, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.labelSem}</Text>
            <TextInput
              style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
              keyboardType="numeric"
              value={form.semester}
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              onChangeText={(text) => setForm({ ...form, semester: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                <Text style={styles.btnTextCancel}>{t.btnCancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSaveProfile} activeOpacity={0.7}>
                <Text style={styles.btnTextSave}>{t.btnSave}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  containerLight: { backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  profileCard: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1 },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', elevation: 2 },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  avatarCircleLight: { backgroundColor: '#EEF2F6' },
  avatarCircleDark: { backgroundColor: '#334155' },
  profileName: { fontSize: 20, fontWeight: '700' },
  profileNim: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  profileSemester: { fontSize: 13, marginTop: 2, fontWeight: '400' },
  btnEdit: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  btnEditLight: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  btnEditDark: { backgroundColor: '#1E293B', borderColor: '#4F46E5' },
  btnEditText: { fontWeight: '600', fontSize: 13 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, marginLeft: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statsCard: { flex: 1, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, elevation: 1 },
  statsValue: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  statsLabel: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  infoBox: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, elevation: 1, marginBottom: 30 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 14, fontWeight: '600' },
  infoSubText: { fontSize: 13, fontWeight: '500' },
  statusBadge: { backgroundColor: '#ECFDF5', color: '#10B981', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  divider: { height: 1 },
  dividerLight: { backgroundColor: '#F1F5F9' },
  dividerDark: { backgroundColor: '#334155' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalContentLight: { backgroundColor: '#FFFFFF' },
  modalContentDark: { backgroundColor: '#1E293B' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  inputLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.3 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, fontSize: 14 },
  inputLight: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' },
  inputDark: { backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#F1F5F9' },
  btnSave: { backgroundColor: '#4F46E5' },
  btnTextCancel: { color: '#64748B', fontWeight: '600', fontSize: 15 },
  btnTextSave: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  textLight: { color: '#1E293B' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' }
});