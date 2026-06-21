// ============================================================
// APP CONTEXT — State Management Global (Enhanced with Networking)
// Mengelola data mahasiswa, mata kuliah, tema, dan sinkronisasi
// ============================================================

import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import COURSES_DATA from '../data/courses';
import { fetchCoursesFromServer, postCourseToServer as apiPostCourse } from '../services/apiService';
import { sendCourseUpdateNotification, sendSyncCompleteNotification } from '../services/notificationService';
import { cacheData, getCachedData } from '../services/storage';

// ============================================================
// INTERFACES — Definisi Struktur Data TypeScript
// ============================================================
export interface Mahasiswa {
  nim: string;
  nama: string;
  semester: string;
  language?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  sks: string | number;
  dosen: string;
  notes?: string;
  email?: string;
  phone?: string;
  description?: string;
  location?: string;
  fromServer?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface AppContextType {
  // Data asli (dari tugas sebelumnya)
  mahasiswa: Mahasiswa;
  updateMahasiswa: (updatedData: Mahasiswa) => Promise<void>;
  courses: Course[];
  addCourse: (newCourse: Omit<Course, 'id'>) => Promise<void>;
  editCourse: (courseId: string, updatedCourseData: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  loading: boolean;
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;

  // Networking (Fitur Baru)
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
  syncFromServer: () => Promise<void>;
  postNewCourseToServer: (course: Omit<Course, 'id'>) => Promise<boolean>;

  // Background Sync (Fitur Baru)
  bgSyncEnabled: boolean;
  setBgSyncEnabled: (enabled: boolean) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================
// PROVIDER COMPONENT
// ============================================================
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State dari tugas sebelumnya
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa>({
    nim: '233510312',
    nama: 'Sahrul Efendi',
    semester: '6',
    language: 'id',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // State Networking (Baru)
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // State Background Sync (Baru)
  const [bgSyncEnabled, setBgSyncEnabledState] = useState<boolean>(false);

  // Ref untuk AppState listener
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Refs to avoid stale closures in listeners
  const coursesRef = useRef<Course[]>([]);
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  // Deklarasi Kunci Storage Konstan
  const STORAGE_KEYS = {
    MAHASISWA: '@pam_mahasiswa',
    THEME: '@pam_theme',
    COURSES: '@courses_cache',
    LAST_SYNC: '@last_sync_time',
    BG_SYNC_ENABLED: '@bg_sync_enabled',
  };

  // ============================================================
  // INIT — Setup listeners dan load data awal
  // ============================================================
  useEffect(() => {
    loadInitialData();
    setupNetInfoListener();
    setupAppStateListener();

    return () => {
      // Cleanup listeners
    };
  }, []);

  // ============================================================
  // NETINFO LISTENER — Pantau status koneksi internet realtime
  // ============================================================
  const setupNetInfoListener = () => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setIsOnline(online);
      console.log(`[NetInfo] Connection: ${online ? 'Online' : 'Offline'} (${state.type})`);
    });

    // Initial check
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });

    return unsubscribe;
  };

  // ============================================================
  // APPSTATE LISTENER — Auto-sync saat app kembali dari background
  // ============================================================
  const setupAppStateListener = () => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      // Ketika app kembali aktif dari background
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('[AppState] App resumed — triggering auto-sync...');
        
        // Cek koneksi dulu
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          // Jalankan sync di background tanpa mengganggu UI
          syncFromServerInternal(true);
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  };

  // ============================================================
  // 1. READ & INJECT INITIAL DATA
  // ============================================================
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const savedMahasiswa = await AsyncStorage.getItem(STORAGE_KEYS.MAHASISWA);
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      const cachedCourses = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      const savedLastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      const savedBgSync = await AsyncStorage.getItem(STORAGE_KEYS.BG_SYNC_ENABLED);

      if (savedMahasiswa) setMahasiswa(JSON.parse(savedMahasiswa));
      if (savedTheme) setIsDarkMode(JSON.parse(savedTheme));
      if (savedLastSync) setLastSyncTime(savedLastSync);
      if (savedBgSync) setBgSyncEnabledState(savedBgSync === 'true');

      // Cek apakah cache ada DAN isinya memiliki panjang data (> 0)
      if (cachedCourses && JSON.parse(cachedCourses).length > 0) {
        const parsed = JSON.parse(cachedCourses);
        coursesRef.current = parsed;
        setCourses(parsed);
      } else {
        // Jika cache kosong, masukkan data awal dari courses.ts
        coursesRef.current = COURSES_DATA;
        setCourses(COURSES_DATA);
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(COURSES_DATA));
      }

      // Cache ke MMKV juga untuk fast load
      const mmkvCached = getCachedData('matakuliah_cache');
      if (!mmkvCached && cachedCourses) {
        cacheData('matakuliah_cache', JSON.parse(cachedCourses));
      }

    } catch (error) {
      console.error('Gagal memuat data dari AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 2. UPDATE — Menyimpan perubahan profil mahasiswa
  // ============================================================
  const updateMahasiswa = async (updatedData: Mahasiswa) => {
    try {
      setMahasiswa(updatedData);
      await AsyncStorage.setItem(STORAGE_KEYS.MAHASISWA, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Gagal menyimpan data mahasiswa:', error);
    }
  };

  // ============================================================
  // 3. CREATE — Tambah mata kuliah baru (+ POST ke server)
  // ============================================================
  const addCourse = async (newCourse: Omit<Course, 'id'>) => {
    try {
      const completeCourseWithIntent: Course = {
        ...newCourse,
        id: Date.now().toString(),
        phone: '+6281234567890',
        email: 'dosen.teknik@uir.ac.id',
        description: newCourse.description || 'Mata kuliah rumpun Informatika Universitas Islam Riau.',
        location: 'Fakultas Teknik UIR, Pekanbaru',
        fromServer: false,
        coordinates: {
          latitude: -0.4545,
          longitude: 101.4485,
        },
      };

      const updatedCourses = [...coursesRef.current, completeCourseWithIntent];
      coursesRef.current = updatedCourses;
      setCourses(updatedCourses);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      cacheData('matakuliah_cache', updatedCourses);
    } catch (error) {
      console.error('Gagal menambah mata kuliah:', error);
    }
  };

  // ============================================================
  // 4. EDIT — Mengubah data mata kuliah
  // ============================================================
  const editCourse = async (courseId: string, updatedCourseData: Partial<Course>) => {
    try {
      const updatedCourses = coursesRef.current.map((course) =>
        String(course.id) === String(courseId) ? { ...course, ...updatedCourseData } : course
      );
      coursesRef.current = updatedCourses;
      setCourses(updatedCourses);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      cacheData('matakuliah_cache', updatedCourses);
    } catch (error) {
      console.error('Gagal mengedit mata kuliah:', error);
    }
  };

  // ============================================================
  // 5. DELETE — Menghapus mata kuliah
  // ============================================================
  const deleteCourse = async (courseId: string) => {
    try {
      const updatedCourses = coursesRef.current.filter((course) => String(course.id) !== String(courseId));
      coursesRef.current = updatedCourses;
      setCourses(updatedCourses);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      cacheData('matakuliah_cache', updatedCourses);
    } catch (error) {
      console.error('Gagal menghapus mata kuliah:', error);
    }
  };

  // ============================================================
  // 6. THEME — Mode gelap / terang
  // ============================================================
  const toggleTheme = async () => {
    try {
      const nextTheme = !isDarkMode;
      setIsDarkMode(nextTheme);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(nextTheme));
    } catch (error) {
      console.error('Gagal mengubah tema:', error);
    }
  };

  // ============================================================
  // 7. RESET — Bersihkan semua data
  // ============================================================
  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.COURSES);
      coursesRef.current = [];
      setCourses([]);
      cacheData('matakuliah_cache', []);
    } catch (error) {
      console.error('Gagal mereset data perkuliahan:', error);
    }
  };

  // ============================================================
  // 8. SYNC FROM SERVER — Fetch + merge data dari API
  // ============================================================
  const syncFromServer = async () => {
    await syncFromServerInternal(false);
  };

  const syncFromServerInternal = async (silent: boolean = false) => {
    if (isSyncingRef.current) return; // Prevent double sync
 
    try {
      isSyncingRef.current = true;
      if (!silent) setIsSyncing(true);
      setSyncError(null);
 
      console.log('[Sync] Starting sync from server...');
 
      const result = await fetchCoursesFromServer();
 
      if (!result.success) {
        setSyncError(result.error || 'Gagal sinkronisasi');
        console.error('[Sync] Failed:', result.error);
        return;
      }
 
      // Merge logic: Data server + data lokal (tanpa duplikat berdasarkan ID)
      const currentCourses = coursesRef.current;
      const localIds = new Set(currentCourses.map((c) => c.id));
      const newServerCourses = result.data.filter((serverCourse) => !localIds.has(serverCourse.id));
 
      if (newServerCourses.length > 0) {
        const mergedCourses = [...currentCourses, ...newServerCourses];
        setCourses(mergedCourses);
 
        // Simpan ke kedua storage
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mergedCourses));
        cacheData('matakuliah_cache', mergedCourses);
 
        // Kirim notifikasi hanya jika bukan silent
        if (!silent) {
          await sendSyncCompleteNotification(mergedCourses.length, newServerCourses.length);
        }
 
        console.log(`[Sync] Merged ${newServerCourses.length} new courses. Total: ${mergedCourses.length}`);
      } else {
        console.log('[Sync] No new courses found');
        if (!silent) {
          await sendSyncCompleteNotification(currentCourses.length, 0);
        }
      }
 
      // Update waktu sync terakhir
      const syncTime = new Date().toISOString();
      setLastSyncTime(syncTime);
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, syncTime);

    } catch (error) {
      console.error('[Sync] Unexpected error:', error);
      setSyncError('Terjadi kesalahan tidak terduga saat sinkronisasi');
    } finally {
      isSyncingRef.current = false;
      if (!silent) setIsSyncing(false);
    }
  };

  // ============================================================
  // 9. POST COURSE TO SERVER — Kirim data baru ke server
  // ============================================================
  const postNewCourseToServer = async (course: Omit<Course, 'id'>): Promise<boolean> => {
    try {
      const result = await apiPostCourse({
        name: course.name,
        code: course.code,
        sks: course.sks,
        dosen: course.dosen,
        notes: course.notes,
      });

      if (result.success) {
        console.log('[POST] Course posted to server successfully');
        return true;
      } else {
        console.error('[POST] Failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('[POST] Unexpected error:', error);
      return false;
    }
  };

  // ============================================================
  // 10. BACKGROUND SYNC TOGGLE
  // ============================================================
  const setBgSyncEnabled = async (enabled: boolean) => {
    setBgSyncEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.BG_SYNC_ENABLED, String(enabled));
  };

  // ============================================================
  // PROVIDER RENDER
  // ============================================================
  return (
    <AppContext.Provider
      value={{
        // Data asli
        mahasiswa,
        updateMahasiswa,
        courses,
        addCourse,
        editCourse,
        deleteCourse,
        clearAllData,
        loading,
        isDarkMode,
        toggleTheme,

        // Networking
        isOnline,
        isSyncing,
        lastSyncTime,
        syncError,
        syncFromServer,
        postNewCourseToServer,

        // Background
        bgSyncEnabled,
        setBgSyncEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};