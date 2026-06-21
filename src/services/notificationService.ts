// ============================================================
// NOTIFICATION SERVICE — Local Push Notification (expo-notifications)
// Mengelola izin dan pengiriman notifikasi lokal
// ============================================================

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// 1. KONFIGURASI HANDLER — Cara notifikasi ditampilkan
// ============================================================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ============================================================
// 2. REQUEST PERMISSION — Minta izin notifikasi dari pengguna
// ============================================================
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notification] Permission not granted');
      return false;
    }

    // Konfigurasi channel untuk Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('eduguide-updates', {
        name: 'EduGuide Updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
        sound: 'default',
      });
    }

    console.log('[Notification] Permission granted');
    return true;
  } catch (error) {
    console.error('[Notification] Error requesting permission:', error);
    return false;
  }
};

// ============================================================
// 3. SEND LOCAL NOTIFICATION — Kirim notifikasi lokal generik
// ============================================================
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string | null> => {
  try {
    const isEnabled = await AsyncStorage.getItem('@notifications_enabled');
    if (isEnabled === 'false') {
      console.log('[Notification] Suppressed: Notifications are disabled in settings');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'eduguide-updates' }),
      },
      trigger: null, // Kirim langsung (segera)
    });

    console.log(`[Notification] Sent: "${title}" (ID: ${notificationId})`);
    return notificationId;
  } catch (error) {
    console.error('[Notification] Error sending notification:', error);
    return null;
  }
};

// ============================================================
// 4. COURSE UPDATE NOTIFICATION — Notifikasi update mata kuliah
// ============================================================
export const sendCourseUpdateNotification = async (
  newCourseCount: number
): Promise<void> => {
  if (newCourseCount <= 0) return;

  await sendLocalNotification(
    '📚 Update Mata Kuliah Baru!',
    `Ditemukan ${newCourseCount} mata kuliah baru dari server. Buka aplikasi untuk melihat detailnya.`,
    { type: 'course_update', count: newCourseCount }
  );
};

// ============================================================
// 5. DEADLINE SKS NOTIFICATION — Notifikasi deadline/pengingat
// ============================================================
export const sendDeadlineNotification = async (
  courseName: string
): Promise<void> => {
  await sendLocalNotification(
    '⏰ Pengingat Deadline SKS',
    `Jangan lupa mengisi KRS untuk mata kuliah "${courseName}" sebelum batas waktu!`,
    { type: 'deadline_reminder', course: courseName }
  );
};

// ============================================================
// 6. SYNC COMPLETE NOTIFICATION — Notifikasi sync selesai
// ============================================================
export const sendSyncCompleteNotification = async (
  totalCourses: number,
  newCourses: number
): Promise<void> => {
  const body = newCourses > 0
    ? `Sinkronisasi selesai. ${newCourses} mata kuliah baru ditambahkan. Total: ${totalCourses} mata kuliah.`
    : `Sinkronisasi selesai. Data sudah terbaru (${totalCourses} mata kuliah).`;

  await sendLocalNotification(
    '✅ Sync Berhasil',
    body,
    { type: 'sync_complete', total: totalCourses, new: newCourses }
  );
};

// ============================================================
// 7. LISTENER — Setup listener notifikasi (opsional)
// ============================================================
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};
