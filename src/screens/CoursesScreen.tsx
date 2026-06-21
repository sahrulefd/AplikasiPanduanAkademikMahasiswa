// ============================================================
// COURSES SCREEN — Daftar Mata Kuliah (Enhanced with Networking)
// Pull-to-Refresh, Sync, POST, Loading/Error State, Connection Badge
// ============================================================

import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { Search, Plus, X, BookOpen, User, Trash2, RefreshCw, CloudOff, Cloud, Send, AlertCircle, Share2 } from 'lucide-react-native';
import { Share } from 'react-native';

// Definisikan Interface untuk Type Safety TypeScript
interface Course {
  id: string;
  name: string;
  code: string;
  sks: string | number;
  dosen: string;
  notes?: string;
  fromServer?: boolean;
}

interface CoursesScreenProps {
  navigation: any;
}

const CoursesScreen: React.FC<CoursesScreenProps> = ({ navigation }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const {
    courses, addCourse, deleteCourse, isDarkMode, mahasiswa,
    isOnline, isSyncing, lastSyncTime, syncError, syncFromServer,
    postNewCourseToServer,
  } = context as any;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    sks: '',
    dosen: '',
    description: '',
    notes: '',
  });

  // Baca bahasa aktif dari global context mahasiswa (default: 'id')
  const currentLanguage = mahasiswa?.language || 'id';

  // Kamus Bahasa untuk Manajemen Mata Kuliah
  const textContent = {
    id: {
      searchPlaceholder: 'Cari nama atau kode mata kuliah...',
      emptyText: 'Belum ada mata kuliah yang diambil.',
      modalTitle: 'Tambah Mata Kuliah',
      phName: 'Nama Mata Kuliah',
      phCode: 'Kode Mata Kuliah',
      phSks: 'Jumlah SKS',
      phDosen: 'Dosen Pengampu',
      phDesc: 'Deskripsi Mata Kuliah (Opsional)',
      phNotes: 'Catatan Kuliah (Opsional)',
      btnCancel: 'Batal',
      btnSave: 'Simpan & Kirim ke Server',
      alertError: 'Semua kolom wajib diisi kecuali catatan!',
      alertSuccess: 'Mata kuliah berhasil disimpan & dikirim ke server!',
      alertSaveOnly: 'Mata kuliah disimpan lokal (offline mode).',
      deleteTitle: 'Hapus',
      deleteSub: 'Hapus mata kuliah',
      deleteBtn: 'Hapus',
      syncBtn: 'Sync dari Server',
      syncing: 'Menyinkronkan...',
      online: 'Online',
      offline: 'Offline',
      lastSync: 'Sync terakhir:',
      syncError: 'Gagal sinkronisasi',
      retry: 'Coba Lagi',
      serverBadge: 'Server',
      localBadge: 'Lokal',
      shareCourse: 'Bagikan',
    },
    en: {
      searchPlaceholder: 'Search course name or code...',
      emptyText: 'No courses taken yet.',
      modalTitle: 'Add New Course',
      phName: 'Course Name',
      phCode: 'Course Code',
      phSks: 'Total Credits (SKS)',
      phDosen: 'Lecturer Name',
      phDesc: 'Course Description (Optional)',
      phNotes: 'Course Notes (Optional)',
      btnCancel: 'Cancel',
      btnSave: 'Save & Post to Server',
      alertError: 'All fields are required except notes!',
      alertSuccess: 'Course saved & posted to server!',
      alertSaveOnly: 'Course saved locally (offline mode).',
      deleteTitle: 'Delete',
      deleteSub: 'Delete course',
      deleteBtn: 'Delete',
      syncBtn: 'Sync from Server',
      syncing: 'Syncing...',
      online: 'Online',
      offline: 'Offline',
      lastSync: 'Last sync:',
      syncError: 'Sync failed',
      retry: 'Retry',
      serverBadge: 'Server',
      localBadge: 'Local',
      shareCourse: 'Share',
    },
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  const filteredCourses = courses.filter((course: Course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format waktu sync terakhir
  const formatSyncTime = (isoString: string | null) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '-';
    }
  };

  // ============================================================
  // PULL-TO-REFRESH HANDLER
  // ============================================================
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await syncFromServer();
    } finally {
      setIsRefreshing(false);
    }
  };

  // ============================================================
  // SYNC BUTTON HANDLER
  // ============================================================
  const handleSync = async () => {
    await syncFromServer();
  };

  // ============================================================
  // SAVE + POST HANDLER
  // ============================================================
  const handleSave = async () => {
    if (!form.name || !form.code || !form.sks || !form.dosen) {
      Alert.alert('Error', t.alertError);
      return;
    }

    const newCourse = {
      name: form.name,
      code: form.code,
      sks: form.sks,
      dosen: form.dosen,
      description: form.description,
      notes: form.notes,
    };

    // Simpan ke lokal terlebih dahulu
    addCourse(newCourse);

    // POST ke server jika online
    if (isOnline) {
      setIsPosting(true);
      try {
        const posted = await postNewCourseToServer(newCourse);
        setForm({ name: '', code: '', sks: '', dosen: '', description: '', notes: '' });
        setModalVisible(false);
        Alert.alert('Sukses / Success', posted ? t.alertSuccess : t.alertSaveOnly);
      } catch {
        setForm({ name: '', code: '', sks: '', dosen: '', description: '', notes: '' });
        setModalVisible(false);
        Alert.alert('Info', t.alertSaveOnly);
      } finally {
        setIsPosting(false);
      }
    } else {
      setForm({ name: '', code: '', sks: '', dosen: '', description: '', notes: '' });
      setModalVisible(false);
      Alert.alert('Info', t.alertSaveOnly);
    }
  };

  // ============================================================
  // SHARE HANDLER
  // ============================================================
  const handleShareCourse = async (item: Course) => {
    try {
      await Share.share({
        message: `📚 ${item.name}\n📋 Kode: ${item.code}\n📊 SKS: ${item.sks}\n👨‍🏫 Dosen: ${item.dosen}\n\n— Shared via EduGuide Academic`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ============================================================
  // RENDER COURSE ITEM
  // ============================================================
  const renderCourseItem = ({ item }: { item: Course }) => (
    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('DetailMatkulScreen', { course: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderRow}>
          <View style={[styles.iconContainer, isDarkMode ? styles.iconContainerDark : styles.iconContainerLight]}>
            <BookOpen color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={18} />
          </View>
          <View style={styles.headerTextContainer}>
            <View style={styles.codeSourceRow}>
              <Text style={[styles.courseCode, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
                {item.code} • {item.sks} SKS
              </Text>
              {/* Badge sumber data: Server atau Lokal */}
              <View style={[
                styles.sourceBadge,
                item.fromServer
                  ? (isDarkMode ? styles.serverBadgeDark : styles.serverBadgeLight)
                  : (isDarkMode ? styles.localBadgeDark : styles.localBadgeLight)
              ]}>
                <Text style={[
                  styles.sourceBadgeText,
                  item.fromServer
                    ? { color: isDarkMode ? '#34D399' : '#059669' }
                    : { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }
                ]}>
                  {item.fromServer ? t.serverBadge : t.localBadge}
                </Text>
              </View>
            </View>
            <Text style={[styles.courseName, isDarkMode ? styles.textDark : styles.textLight]}>
              {item.name}
            </Text>
          </View>
        </View>

        <View style={styles.dosenRow}>
          <User color={isDarkMode ? '#94A3B8' : '#64748B'} size={14} />
          <Text style={[styles.courseDosen, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {item.dosen}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action Buttons: Share & Delete */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.shareButton, isDarkMode ? styles.shareButtonDark : styles.shareButtonLight]}
          onPress={() => handleShareCourse(item)}
          activeOpacity={0.6}
        >
          <Share2 color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, isDarkMode ? styles.deleteButtonDark : styles.deleteButtonLight]}
          onPress={() => {
            Alert.alert(
              t.deleteTitle,
              `${t.deleteSub} ${item.name}?`,
              [
                { text: t.btnCancel, style: 'cancel' },
                { text: t.deleteBtn, style: 'destructive', onPress: () => deleteCourse(item.id) },
              ]
            );
          }}
          activeOpacity={0.6}
        >
          <Trash2 color="#EF4444" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>

      {/* Connection Status Bar */}
      <View style={[styles.connectionBar, isOnline
        ? (isDarkMode ? styles.connectionOnlineDark : styles.connectionOnlineLight)
        : (isDarkMode ? styles.connectionOfflineDark : styles.connectionOfflineLight)
      ]}>
        {isOnline
          ? <Cloud color={isDarkMode ? '#34D399' : '#059669'} size={14} />
          : <CloudOff color={isDarkMode ? '#F87171' : '#DC2626'} size={14} />
        }
        <Text style={[styles.connectionText, isOnline
          ? { color: isDarkMode ? '#34D399' : '#059669' }
          : { color: isDarkMode ? '#F87171' : '#DC2626' }
        ]}>
          {isOnline ? t.online : t.offline}
        </Text>
        {lastSyncTime && (
          <Text style={[styles.syncTimeText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {t.lastSync} {formatSyncTime(lastSyncTime)}
          </Text>
        )}
      </View>

      {/* Sync Button */}
      <TouchableOpacity
        style={[styles.syncButton, isDarkMode ? styles.syncButtonDark : styles.syncButtonLight,
          isSyncing && styles.syncButtonDisabled]}
        onPress={handleSync}
        disabled={isSyncing}
        activeOpacity={0.7}
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color={isDarkMode ? '#A5B4FC' : '#4F46E5'} />
        ) : (
          <RefreshCw color={isDarkMode ? '#A5B4FC' : '#4F46E5'} size={16} />
        )}
        <Text style={[styles.syncButtonText, { color: isDarkMode ? '#A5B4FC' : '#4F46E5' }]}>
          {isSyncing ? t.syncing : t.syncBtn}
        </Text>
      </TouchableOpacity>

      {/* Error Banner */}
      {syncError && (
        <View style={[styles.errorBanner, isDarkMode ? styles.errorBannerDark : styles.errorBannerLight]}>
          <AlertCircle color="#EF4444" size={16} />
          <Text style={styles.errorText}>{syncError}</Text>
          <TouchableOpacity onPress={handleSync} activeOpacity={0.7}>
            <Text style={styles.retryText}>{t.retry}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar Modern */}
      <View style={[styles.searchWrapper, isDarkMode ? styles.searchWrapperDark : styles.searchWrapperLight]}>
        <Search color={isDarkMode ? '#64748B' : '#94A3B8'} size={20} />
        <TextInput
          style={[styles.searchBar, isDarkMode ? styles.textDark : styles.textLight]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* FlatList with Pull-to-Refresh */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseItem}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
            {t.emptyText}
          </Text>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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

      {/* FAB Premium */}
      <TouchableOpacity
        style={[styles.fab, isDarkMode ? styles.fabDark : styles.fabLight]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>

      {/* Modal Input Modern */}
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
                {t.modalTitle}
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
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnTextCancel}>{t.btnCancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnSave, isPosting && styles.btnDisabled]}
                  onPress={handleSave}
                  activeOpacity={0.7}
                  disabled={isPosting}
                >
                  {isPosting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <View style={styles.btnSaveContent}>
                      <Send color="#FFFFFF" size={14} />
                      <Text style={styles.btnTextSave}>{t.btnSave}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  containerLight: { backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },

  // Connection Status Bar
  connectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  connectionOnlineLight: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  connectionOnlineDark: { backgroundColor: '#064E3B', borderColor: '#047857' },
  connectionOfflineLight: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  connectionOfflineDark: { backgroundColor: '#450A0A', borderColor: '#7F1D1D' },
  connectionText: { fontSize: 12, fontWeight: '700' },
  syncTimeText: { fontSize: 11, fontWeight: '500', marginLeft: 'auto' },

  // Sync Button
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  syncButtonLight: { backgroundColor: '#EEF2F6', borderColor: '#C7D2FE' },
  syncButtonDark: { backgroundColor: '#1E1B4B', borderColor: '#4338CA' },
  syncButtonDisabled: { opacity: 0.6 },
  syncButtonText: { fontSize: 13, fontWeight: '600' },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  errorBannerLight: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  errorBannerDark: { backgroundColor: '#450A0A', borderColor: '#7F1D1D' },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '500', flex: 1 },
  retryText: { color: '#4F46E5', fontSize: 12, fontWeight: '700' },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    height: 48,
  },
  searchWrapperLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  searchWrapperDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  searchBar: { flex: 1, marginLeft: 10, fontSize: 14, height: '100%' },

  listContainer: { paddingBottom: 90 },

  // Card
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },

  cardContent: { flex: 1 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconContainer: { padding: 8, borderRadius: 8 },
  iconContainerLight: { backgroundColor: '#EEF2F6' },
  iconContainerDark: { backgroundColor: '#334155' },
  headerTextContainer: { flex: 1 },

  codeSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  courseCode: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  courseName: { fontSize: 16, fontWeight: '600', marginTop: 2, marginBottom: 8 },

  // Source Badge (Server/Lokal)
  sourceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  serverBadgeLight: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  serverBadgeDark: { backgroundColor: '#064E3B', borderColor: '#047857' },
  localBadgeLight: { backgroundColor: '#EEF2F6', borderColor: '#C7D2FE' },
  localBadgeDark: { backgroundColor: '#1E1B4B', borderColor: '#4338CA' },
  sourceBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },

  dosenRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  courseDosen: { fontSize: 13, fontWeight: '500' },

  // Card Actions
  cardActions: { gap: 6, marginLeft: 8 },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  shareButtonLight: { backgroundColor: '#EEF2F6', borderColor: '#C7D2FE' },
  shareButtonDark: { backgroundColor: '#1E1B4B', borderColor: '#4338CA' },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteButtonLight: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' },
  deleteButtonDark: { backgroundColor: '#7F1D1D', borderColor: '#991B1B' },

  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14, fontWeight: '500' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  fabLight: { backgroundColor: '#4F46E5' },
  fabDark: { backgroundColor: '#6366F1' },

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
  btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#F1F5F9' },
  btnSave: { backgroundColor: '#4F46E5' },
  btnDisabled: { opacity: 0.7 },
  btnSaveContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnTextCancel: { color: '#64748B', fontWeight: '600', fontSize: 15 },
  btnTextSave: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  textLight: { color: '#1E293B' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
});