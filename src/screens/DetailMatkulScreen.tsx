import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Share2, MessageSquare, Trash2, Edit, X, Send } from 'lucide-react-native';

interface DetailMatkulScreenProps {
  route: any;
  navigation: any;
}

export const DetailMatkulScreen: React.FC<DetailMatkulScreenProps> = ({ route, navigation }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { courses, editCourse, deleteCourse, isDarkMode, mahasiswa } = context as any;

  const passedCourse = route.params?.course || route.params;
  const currentCourseId = passedCourse?.id || passedCourse?.courseId;
  
  const mk = courses.find((item: any) => String(item.id) === String(currentCourseId)) || passedCourse;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: mk.name,
    code: mk.code,
    sks: String(mk.sks),
    dosen: mk.dosen || '',
    description: mk.description || '',
    notes: mk.notes || '',
  });

  const handleOpenEdit = () => {
    setForm({
      name: mk.name,
      code: mk.code,
      sks: String(mk.sks),
      dosen: mk.dosen || '',
      description: mk.description || '',
      notes: mk.notes || '',
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

    await editCourse(mk.id, updatedData);
    setModalVisible(false);
    Alert.alert(currentLanguage === 'id' ? 'Sukses' : 'Success', t.alertSuccess);
  };

  // 1. Ambil status bahasa aktif dari context global (default: 'id')
  const currentLanguage = mahasiswa?.language || 'id';

  // 2. Kamus Terjemahan Halaman Detail Mata Kuliah
  const textContent = {
    id: {
      headerTitle: 'Detail Kelas',
      notFound: 'Data mata kuliah tidak ditemukan',
      lblTitle: 'NAMA MATA KULIAH',
      lblCode: 'KODE & SKS',
      lblLecturer: 'DOSEN PENGAMPU',
      lblNotes: 'CATATAN BELAJAR',
      noNotes: 'Tidak ada catatan.',
      btnShare: 'Bagikan',
      btnContact: 'Hubungi Dosen',
      btnDelete: 'Hapus Mata Kuliah',
      waMessage: `Halo Bapak/Ibu ${mk?.dosen}, saya mahasiswa di kelas ${mk?.name}.`,
      waError: 'Aplikasi WhatsApp tidak terinstall di perangkat ini',
      delTitle: 'Hapus Mata Kuliah',
      delSub: `Apakah Anda yakin ingin menghapus kelas ${mk?.name}?`,
      btnCancel: 'Batal',
      btnConfirmDel: 'Hapus',
      shareCourse: 'Mata Kuliah',
      shareLecturer: 'Dosen',
      shareNotes: 'Catatan',
      noNotesText: 'Tidak ada',
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
      notFound: 'Course data not found',
      lblTitle: 'COURSE NAME',
      lblCode: 'CODE & CREDITS (SKS)',
      lblLecturer: 'LECTURER',
      lblNotes: 'COURSE NOTES',
      noNotes: 'No notes available.',
      btnShare: 'Share',
      btnContact: 'Contact Lecturer',
      btnDelete: 'Delete Course',
      waMessage: `Hello Professor ${mk?.dosen}, I am a student from your ${mk?.name} class.`,
      waError: 'WhatsApp application is not installed on this device',
      delTitle: 'Delete Course',
      delSub: `Are you sure you want to delete ${mk?.name} class?`,
      btnCancel: 'Cancel',
      btnConfirmDel: 'Delete',
      shareCourse: 'Course',
      shareLecturer: 'Lecturer',
      shareNotes: 'Notes',
      noNotesText: 'None',
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

  // 3. Mengubah judul "Detail Kelas" di header navigasi secara dinamis
  useEffect(() => {
    navigation.setOptions({
      title: t.headerTitle,
    });
  }, [currentLanguage, navigation, t.headerTitle]);

  if (!mk || !mk.name) {
    return (
      <View style={[styles.center, isDarkMode ? styles.containerDark : styles.containerLight]}>
        <Text style={isDarkMode ? styles.textDark : styles.textLight}>{t.notFound}</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t.shareCourse}: ${mk.name} (${mk.code}) - ${mk.sks} SKS. ${t.shareLecturer}: ${mk.dosen}. ${t.shareNotes}: ${mk.notes || t.noNotesText}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactDosen = () => {
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(t.waMessage)}`).catch(() => {
      Alert.alert('Error', t.waError);
    });
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
            await deleteCourse(mk.id);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.scrollView, isDarkMode ? styles.containerDark : styles.containerLight]} contentContainerStyle={styles.scrollContent}>
      
      {/* Box Detail Informasi */}
      <View style={[styles.detailBox, isDarkMode ? styles.detailBoxDark : styles.detailBoxLight]}>
        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblTitle}</Text>
        <Text style={[styles.value, isDarkMode ? styles.textDark : styles.textLight]}>{mk.name}</Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblCode}</Text>
        <Text style={[styles.value, isDarkMode ? styles.textDark : styles.textLight]}>{mk.code} • {mk.sks} SKS</Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblLecturer}</Text>
        <Text style={[styles.value, isDarkMode ? styles.textDark : styles.textLight]}>{mk.dosen || '-'}</Text>

        <Text style={[styles.label, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>{t.lblNotes}</Text>
        <Text style={[styles.catatanText, isDarkMode ? styles.textDark : styles.textLight]}>
          {mk.notes || t.noNotes}
        </Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.btn, isDarkMode ? styles.btnShareDark : styles.btnShareLight]} 
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={18} />
          <Text style={[styles.btnText, { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }]}>{t.btnShare}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, isDarkMode ? styles.btnContactDark : styles.btnContactLight]} 
          onPress={handleContactDosen}
          activeOpacity={0.7}
        >
          <MessageSquare color={isDarkMode ? '#34D399' : '#10B981'} size={18} />
          <Text style={[styles.btnText, { color: isDarkMode ? '#34D399' : '#10B981' }]}>{t.btnContact}</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Edit Premium */}
      <TouchableOpacity 
        style={[styles.btnEdit, isDarkMode ? styles.btnEditDark : styles.btnEditLight]} 
        onPress={handleOpenEdit}
        activeOpacity={0.7}
      >
        <Edit color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={18} />
        <Text style={[styles.btnEditText, { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }]}>{t.btnEdit}</Text>
      </TouchableOpacity>

      {/* Tombol Hapus Premium */}
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
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  container: { flex: 1, padding: 20 },
  containerLight: { backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  detailBox: { padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1 },
  detailBoxLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  detailBoxDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  catatanText: { fontSize: 14, lineHeight: 22 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1 },
  btnShareLight: { backgroundColor: '#EEF2F6', borderColor: '#4F46E5' },
  btnShareDark: { backgroundColor: '#1E1B4B', borderColor: '#4F46E5' },
  btnContactLight: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  btnContactDark: { backgroundColor: '#064E3B', borderColor: '#10B981' },
  btnText: { fontWeight: '600', fontSize: 14 },
  
  btnEdit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
  btnEditLight: { backgroundColor: '#EEF2F6', borderColor: '#4F46E5' },
  btnEditDark: { backgroundColor: '#1E293B', borderColor: '#4F46E5' },
  btnEditText: { fontWeight: '600', fontSize: 14 },

  btnDelete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1 },
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

export default DetailMatkulScreen;