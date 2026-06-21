// ============================================================
// BACKGROUND SERVICE — Background Fetch & Task Manager
// Sinkronisasi data berkala di background (expo-task-manager)
// ============================================================

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCoursesFromServer } from './apiService';
import { sendCourseUpdateNotification } from './notificationService';

// Nama task unik untuk background fetch
export const BACKGROUND_FETCH_TASK = 'EDUGUIDE_BACKGROUND_SYNC';

// Storage keys (sama dengan AppContext)
const STORAGE_KEYS = {
  COURSES: '@courses_cache',
  LAST_SYNC: '@last_sync_time',
  BG_SYNC_ENABLED: '@bg_sync_enabled',
};

// ============================================================
// 1. DEFINISI BACKGROUND TASK — Logic yang dijalankan di background
// ============================================================
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('[Background] Starting background sync task...');

    // Cek apakah background sync diaktifkan pengguna
    const bgSyncEnabled = await AsyncStorage.getItem(STORAGE_KEYS.BG_SYNC_ENABLED);
    if (bgSyncEnabled === 'false') {
      console.log('[Background] Background sync is disabled by user');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Fetch data terbaru dari server
    const result = await fetchCoursesFromServer();

    if (!result.success || result.data.length === 0) {
      console.log('[Background] No new data from server');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Ambil data lokal saat ini
    const localDataRaw = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    const localCourses = localDataRaw ? JSON.parse(localDataRaw) : [];

    // Hitung mata kuliah baru yang belum ada di lokal
    const localIds = new Set(localCourses.map((c: any) => c.id));
    const newCourses = result.data.filter((c) => !localIds.has(c.id));

    if (newCourses.length > 0) {
      // Merge data baru dengan data lokal
      const mergedCourses = [...localCourses, ...newCourses];
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mergedCourses));

      // Kirim notifikasi tentang data baru
      await sendCourseUpdateNotification(newCourses.length);

      console.log(`[Background] Synced ${newCourses.length} new courses`);
    }

    // Update waktu sync terakhir
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    console.log('[Background] Background sync completed successfully');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[Background] Background sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// ============================================================
// 2. REGISTER — Mendaftarkan periodic background fetch
// ============================================================
export const registerBackgroundFetch = async (): Promise<boolean> => {
  try {
    // Cek apakah background fetch tersedia di perangkat
    const status = await BackgroundFetch.getStatusAsync();

    if (status === BackgroundFetch.BackgroundFetchStatus.Denied) {
      console.log('[Background] Background fetch is denied by OS');
      return false;
    }

    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log('[Background] Background fetch is restricted');
      return false;
    }

    // Daftarkan task dengan interval 30 menit (minimum di iOS adalah 15 menit)
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 30 * 60, // 30 menit dalam detik
      stopOnTerminate: false,   // Tetap jalan meski app ditutup (Android)
      startOnBoot: true,        // Jalankan setelah boot (Android)
    });

    // Simpan status aktif ke storage
    await AsyncStorage.setItem(STORAGE_KEYS.BG_SYNC_ENABLED, 'true');

    console.log('[Background] Background fetch registered successfully');
    return true;
  } catch (error) {
    console.error('[Background] Failed to register background fetch:', error);
    return false;
  }
};

// ============================================================
// 3. UNREGISTER — Membatalkan background fetch
// ============================================================
export const unregisterBackgroundFetch = async (): Promise<void> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('[Background] Background fetch unregistered');
    }

    await AsyncStorage.setItem(STORAGE_KEYS.BG_SYNC_ENABLED, 'false');
  } catch (error) {
    console.error('[Background] Failed to unregister background fetch:', error);
  }
};

// ============================================================
// 4. STATUS CHECK — Cek status background fetch saat ini
// ============================================================
export const getBackgroundFetchStatus = async (): Promise<{
  isRegistered: boolean;
  status: string;
  isEnabled: boolean;
}> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    const status = await BackgroundFetch.getStatusAsync();
    const bgSyncEnabled = await AsyncStorage.getItem(STORAGE_KEYS.BG_SYNC_ENABLED);

    const statusText = {
      [BackgroundFetch.BackgroundFetchStatus.Denied]: 'Denied',
      [BackgroundFetch.BackgroundFetchStatus.Restricted]: 'Restricted',
      [BackgroundFetch.BackgroundFetchStatus.Available]: 'Available',
    };

    return {
      isRegistered,
      status: statusText[status] || 'Unknown',
      isEnabled: bgSyncEnabled !== 'false',
    };
  } catch (error) {
    console.error('[Background] Error checking status:', error);
    return {
      isRegistered: false,
      status: 'Error',
      isEnabled: false,
    };
  }
};

// ============================================================
// 5. GET LAST SYNC TIME — Ambil waktu sync terakhir
// ============================================================
export const getLastSyncTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch {
    return null;
  }
};
