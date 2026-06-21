// JALUR FILE UTAMA: D:/PAM/App_edu/src/screens/CourseDetailScreen.tsx

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Alert, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Share2, MessageSquare, Trash2, Mail, MapPin, Edit, X, Send } from 'lucide-react-native';

interface CourseDetailScreenProps {
  route: any;
  navigation: any;
}

export const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ route, navigation }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { courses, editCourse, deleteCourse, isDarkMode, mahasiswa } = context as any;

  // Mengambil parameter navigasi secara aman
  const passedCourse = route.params?.course || route.params;
  const currentCourseId = passedCourse?.id || passedCourse?.courseId;
  
  // Mencari data real-time dari AppContext
  const foundCourse = courses.find((item: any) => String(item.id) === String(currentCourseId));
  
  const course = foundCourse || passedCourse || {
    name: 'Mata Kuliah Kelolaan',
    code: 'TI-XXXXX',
    sks: 3,
    dosen: 'Dosen Pengampu',
    notes: ''
  };

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: course.name,
    code: course.code,
    sks: String(course.sks),
    dosen: course.dosen || '',
    description: course.description || '',
    notes: course.notes || '',
  });

  const handleOpenEdit = () => {
    setForm({
      name: course.name,
      code: course.code,
      sks: String(course.sks),
      dosen: course.dosen || '',
      description: course.description || '',
      notes: course.notes || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code || !form.sks || !form.dosen) {
      Alert.alert('Error', t.alertError);
      return;
    }

    const updatedData = {
      name: form.name,
      code: form.code,
      sks: isNaN(Number(form.sks)) ? form.sks : Number(form.sks),
      dosen: form.dosen,
      description: form.description,
      notes: form.notes,
    };

    await editCourse(course.id, updatedData);
    setModalVisible(false);
    Alert.alert(currentLanguage === 'id' ? 'Sukses' : 'Success', t.alertSuccess);
  };

  const currentLanguage = mahasiswa?.language || 'id';

  // Kamus Terjemahan
  const textContent = {
    id: {
      headerTitle: 'Detail Kelas',
      notFound: 'Data mata kuliah tidak ditemukan atau kosong.',
      btnBack: 'Kembali',
      lblTitle: 'NAMA MATA KULIAH',
      lblCode: 'KODE & SKS',
      lblLecturer: 'DOSEN PENGAMPU',
      lblDesc: 'DESKRIPSI MATA KULIAH',
      lblLocation: 'LOKASI PERKULIAHAN',
      lblNotes: 'CATATAN BELAJAR',
      noNotes: 'Tidak ada catatan belajar.',
      btnShare: 'Bagikan',
      btnContact: 'WhatsApp',
      btnEmail: 'Email Dosen',
      btnMaps: 'Lihat Peta',
      btnDelete: 'Hapus Mata Kuliah',
      btnRegister: 'Daftar Kelas Sekarang',
      waMessage: `Halo Bapak/Ibu ${course?.dosen}, saya mahasiswa di kelas ${course?.name}.`,
      waError: 'Aplikasi WhatsApp tidak terinstall di perangkat ini',
      mailError: 'Tidak dapat membuka aplikasi Email',
      mapsError: 'Tidak dapat membuka Google Maps',
      noLecturerError: 'Nama dosen tidak tertera',
      delTitle: 'Hapus Mata Kuliah',
      delSub: `Apakah Anda yakin ingin menghapus kelas ${course?.name}?`,
      btnCancel: 'Batal',
      btnConfirmDel: 'Hapus',
      shareCourse: 'Mata Kuliah',
      shareLecturer: 'Dosen',
      btnEdit: 'Edit Mata Kuliah',
      modalEditTitle: 'Edit Mata Kuliah',
      phName: 'Nama Mata Kuliah',
      phCode: 'Kode Mata Kuliah',
      phSks: 'Jumlah SKS',
      phDosen: 'Dosen Pengampu',
      phDesc: 'Deskripsi Mata Kuliah (Opsional)',
      phNotes: 'Catatan Kuliah (Opsional)',
      alertError: 'Semua kolom wajib diisi kecuali catatan!',
      alertSuccess: 'Perubahan mata kuliah berhasil disimpan!',
      btnSave: 'Simpan Perubahan',
    },
    en: {
      headerTitle: 'Class Details',
      notFound: 'Course data not found or empty.',
      btnBack: 'Go Back',
      lblTitle: 'COURSE NAME',
      lblCode: 'CODE & CREDITS (SKS)',
      lblLecturer: 'LECTURER',
      lblDesc: 'COURSE DESCRIPTION',
      lblLocation: 'CLASS LOCATION',
      lblNotes: 'COURSE NOTES',
      noNotes: 'No notes available.',
      btnShare: 'Share',
      btnContact: 'WhatsApp',
      btnEmail: 'Email',
      btnMaps: 'View Maps',
      btnDelete: 'Delete Course',
      btnRegister: 'Register Class Now',
      waMessage: `Hello Professor ${course?.dosen}, I am a student from your ${course?.name} class.`,
      waError: 'WhatsApp application is not installed on this device',
      mailError: 'Cannot open Email application',
      mapsError: 'Cannot open Google Maps',
      noLecturerError: 'Lecturer name is not available',
      delTitle: 'Delete Course',
      delSub: `Are you sure you want to delete ${course?.name} class?`,
      btnCancel: 'Cancel',
      btnConfirmDel: 'Delete',
      shareCourse: 'Course',
      shareLecturer: 'Lecturer',
      btnEdit: 'Edit Course',
      modalEditTitle: 'Edit Course',
      phName: 'Course Name',
      phCode: 'Course Code',
      phSks: 'Total Credits (SKS)',
      phDosen: 'Lecturer Name',
      phDesc: 'Course Description (Optional)',
      phNotes: 'Course Notes (Optional)',
      alertError: 'All fields are required except notes!',
      alertSuccess: 'Course updates saved successfully!',
      btnSave: 'Save Changes',
    }
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  useEffect(() => {
    navigation.setOptions({
      title: t.headerTitle,
    });
  }, [currentLanguage, navigation, t.headerTitle]);

  if (!course || !course.name) {
    return (
      <View style={[styles.centerContainer, isDarkMode ? styles.containerDark : styles.containerLight]}>
        <Text style={[styles.errorText, { color: isDarkMode ? '#F8FAFC' : '#EF4444' }]}>
          {t.notFound}
        </Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnBackText}>{t.btnBack}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fitur Intent 1: Share
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t.shareCourse}: ${course.name} (${course.code}). ${t.shareLecturer}: ${course.dosen}. Lokasi: ${course.location || 'Fakultas Teknik UIR'}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Fitur Intent 2: WhatsApp
  const handleContactDosen = () => {
    if (!course.dosen) {
      Alert.alert('Error', t.noLecturerError);
      return;
    }
    const phoneNum = course.phone || '+6281234567890';
    Linking.openURL(`whatsapp://send?phone=${phoneNum}&text=${encodeURIComponent(t.waMessage)}`).catch(() => {
      Alert.alert('Error', t.waError);
    });
  };

  // Fitur Intent 3: Email Bawaan
  const handleEmailDosen = () => {
    const emailTarget = course.email || 'dosen.teknik@uir.ac.id';
    Linking.openURL(`mailto:${emailTarget}?subject=Perkuliahan ${course.name}`).catch(() => {
      Alert.alert('Error', t.mailError);
    });
  };

  // Fitur Intent 4: Google Maps Berdasarkan Koordinat
  const handleOpenMaps = () => {
    const lat = course.coordinates?.latitude || -0.4545;
    const lng = course.coordinates?.longitude || 101.4485;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', t.mapsError);
    });
  };

  // Umpan Balik Notifikasi Sukses Pendaftaran
const handleDaftarKelas = () => {
    Alert.alert(
      currentLanguage === 'id' ? 'Pendaftaran Berhasil' : 'Registration Successful',
      currentLanguage === 'id' 
        ? `Anda telah berhasil mendaftar pada mata kuliah ${course.name}.`
        : `You have successfully registered for the ${course.name} course.`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MainTabs');
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t.delTitle,
      t.delSub,
      [
        { text: t.btnCancel, style: 'cancel' },
        {
          text: t.btnConfirmDel,
          style: 'destructive',
          onPress: async () => {
            await deleteCourse(course.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      
      {/* Box Detail Informasi Lengkap */}
      <View style={[styles.detailBox, isDarkMode ? styles.detailBoxDark : styles.detailBoxLight]}>
        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblTitle}</Text>
        <Text style={[styles.value, isDarkMode ? styles.textDark : styles.textLight]}>{course.name}</Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblCode}</Text>
        <Text style={[styles.value, isDarkMode ? styles.textDark : styles.textLight]}>{course.code} • {course.sks} SKS</Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblLecturer}</Text>
        <Text style={[styles.value, isDarkMode ? styles.textDark : styles.textLight]}>{course.dosen || '-'}</Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblDesc}</Text>
        <Text style={[styles.descText, isDarkMode ? styles.textDark : styles.textLight]}>
          {course.description || 'Mata kuliah rumpun Informatika Universitas Islam Riau.'}
        </Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblLocation}</Text>
        <Text style={[styles.descText, isDarkMode ? styles.textDark : styles.textLight]}>
          {course.location || 'Gedung Fakultas Teknik UIR, Pekanbaru'}
        </Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblNotes}</Text>
        <Text style={[styles.catatanText, isDarkMode ? styles.textDark : styles.textLight]}>
          {course.notes || t.noNotes}
        </Text>
      </View>

      {/* Baris Tombol Aksi Komplit (Share, WhatsApp, Email, Maps) */}
      <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.btnAction, isDarkMode ? styles.btnShareDark : styles.btnShareLight]} onPress={handleShare}>
          <Share2 color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={16} />
          <Text style={[styles.btnActionText, { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }]}>{t.btnShare}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAction, isDarkMode ? styles.btnContactDark : styles.btnContactLight]} onPress={handleContactDosen}>
          <MessageSquare color={isDarkMode ? '#34D399' : '#10B981'} size={16} />
          <Text style={[styles.btnActionText, { color: isDarkMode ? '#34D399' : '#10B981' }]}>{t.btnContact}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAction, isDarkMode ? styles.btnEmailDark : styles.btnEmailLight]} onPress={handleEmailDosen}>
          <Mail color={isDarkMode ? '#F43F5E' : '#E11D48'} size={16} />
          <Text style={[styles.btnActionText, { color: isDarkMode ? '#F43F5E' : '#E11D48' }]}>{t.btnEmail}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAction, isDarkMode ? styles.btnMapsDark : styles.btnMapsLight]} onPress={handleOpenMaps}>
          <MapPin color={isDarkMode ? '#F59E0B' : '#D97706'} size={16} />
          <Text style={[styles.btnActionText, { color: isDarkMode ? '#F59E0B' : '#D97706' }]}>{t.btnMaps}</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Kelas Sekarang*/}
      <TouchableOpacity 
        style={[styles.btnRegister, isDarkMode ? styles.btnRegisterDark : styles.btnRegisterLight]} 
        onPress={handleDaftarKelas}
        activeOpacity={0.7}
      >
        <Text style={styles.btnRegisterText}>{t.btnRegister}</Text>
      </TouchableOpacity>

      {/* Tombol Edit */}
      <TouchableOpacity 
        style={[styles.btnEdit, isDarkMode ? styles.btnEditDark : styles.btnEditLight]} 
        onPress={handleOpenEdit}
        activeOpacity={0.7}
      >
        <Edit color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={18} />
        <Text style={[styles.btnEditText, { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }]}>{t.btnEdit}</Text>
      </TouchableOpacity>

      {/* Tombol Delete Utama */}
      <TouchableOpacity 
        style={[styles.btnDelete, isDarkMode ? styles.btnDeleteDark : styles.btnDeleteLight]} 
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Trash2 color="#EF4444" size={18} />
        <Text style={styles.btnDeleteText}>{t.btnDelete}</Text>
      </TouchableOpacity>
      
      {/* Modal Edit Modern */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.modalContentDark : styles.modalContentLight]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode ? styles.textDark : styles.textLight]}>
                {t.modalEditTitle}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.6}>
                <X color={isDarkMode ? '#94A3B8' : '#64748B'} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
              <TextInput
                style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder={t.phName}
                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
              <TextInput
                style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder={t.phCode}
                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                value={form.code}
                onChangeText={(text) => setForm({ ...form, code: text })}
              />
              <TextInput
                style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder={t.phSks}
                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                keyboardType="numeric"
                value={form.sks}
                onChangeText={(text) => setForm({ ...form, sks: text })}
              />
              <TextInput
                style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder={t.phDosen}
                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                value={form.dosen}
                onChangeText={(text) => setForm({ ...form, dosen: text })}
              />
              <TextInput
                style={[styles.input, styles.textArea, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder={t.phDesc}
                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                multiline={true}
                numberOfLines={3}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />
              <TextInput
                style={[styles.input, styles.textArea, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder={t.phNotes}
                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                multiline={true}
                numberOfLines={3}
                value={form.notes}
                onChangeText={(text) => setForm({ ...form, notes: text })}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.btnModal, styles.btnCancel]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnTextCancel}>{t.btnCancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnModal, styles.btnSave]}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <View style={styles.btnSaveContent}>
                    <Send color="#FFFFFF" size={14} />
                    <Text style={styles.btnTextSave}>{t.btnSave}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  containerLight: { backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, marginBottom: 20, textAlign: 'center', fontWeight: '500' },
  btnBack: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  btnBackText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  detailBox: { padding: 20, borderRadius: 14, marginBottom: 16, borderWidth: 1 },
  detailBoxLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  detailBoxDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  value: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  descText: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 16 },
  catatanText: { fontSize: 14, lineHeight: 22 },
  
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  btnAction: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 10, borderWidth: 1 },
  
  btnShareLight: { backgroundColor: '#EEF2F6', borderColor: '#4F46E5' },
  btnShareDark: { backgroundColor: '#1E1B4B', borderColor: '#4F46E5' },
  
  btnContactLight: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  btnContactDark: { backgroundColor: '#064E3B', borderColor: '#10B981' },

  btnEmailLight: { backgroundColor: '#FFF1F2', borderColor: '#E11D48' },
  btnEmailDark: { backgroundColor: '#4C0519', borderColor: '#E11D48' },

  btnMapsLight: { backgroundColor: '#FEF3C7', borderColor: '#D97706' },
  btnMapsDark: { backgroundColor: '#451A03', borderColor: '#D97706' },
  
  btnActionText: { fontWeight: '600', fontSize: 13 },

  btnRegister: { padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1 },
  btnRegisterLight: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  btnRegisterDark: { backgroundColor: '#312E81', borderColor: '#4F46E5' },
  btnRegisterText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  
  btnEdit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1, marginTop: 4, marginBottom: 10 },
  btnEditLight: { backgroundColor: '#EEF2F6', borderColor: '#4F46E5' },
  btnEditDark: { backgroundColor: '#1E293B', borderColor: '#4F46E5' },
  btnEditText: { fontWeight: '600', fontSize: 14 },

  btnDelete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1, marginTop: 4 },
  btnDeleteLight: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' },
  btnDeleteDark: { backgroundColor: '#1E293B', borderColor: '#EF4444' },
  btnDeleteText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
  
  // Modal Edit styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalContentLight: { backgroundColor: '#FFFFFF' },
  modalContentDark: { backgroundColor: '#1E293B' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  formScroll: { paddingBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 14,
  },
  inputLight: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' },
  inputDark: { backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFFFFF' },
  textArea: { height: 90, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 10 },
  btnModal: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#F1F5F9' },
  btnSave: { backgroundColor: '#4F46E5' },
  btnSaveContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnTextCancel: { color: '#64748B', fontWeight: '600', fontSize: 15 },
  btnTextSave: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  textLight: { color: '#1E293B' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#94A3B8' },
  textMutedDark: { color: '#64748B' }
});

export default CourseDetailScreen;