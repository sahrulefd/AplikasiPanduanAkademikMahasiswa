// src/utils/intents.js
import { Linking, Alert, Share } from 'react-native';

// 1. Intent untuk membuka WhatsApp atau Telepon
export const openContact = async (phoneNumber, message = '') => {
  // Kita utamakan via WhatsApp, jika tidak ada baru direct call
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  const telUrl = `tel:${phoneNumber}`;

  try {
    const supported = await Linking.canOpenURL(whatsappUrl);
    if (supported) {
      await Linking.openURL(whatsappUrl);
    } else {
      // Jika WhatsApp tidak terinstall, buka dial pad telepon biasa
      await Linking.openURL(telUrl);
    }
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat membuka aplikasi kontak.');
  }
};

// 2. Intent untuk membuka Google Maps lokasi kampus
export const openMap = async (locationName) => {
  // Menggunakan geo intent untuk membuka Google Maps aplikasi native
  const url = `geo:0,0?q=${encodeURIComponent(locationName)}`;
  
  try {
    await Linking.openURL(url);
  } catch (error) {
    // Fallback jika geo scheme bermasalah, buka via browser
    const browserUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    Linking.openURL(browserUrl);
  }
};

// 3. Intent untuk mengirim Email ke Dosen
export const sendEmail = async (emailTo, subject, body) => {
  const url = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat membuka aplikasi Email.');
  }
};

// 4. Intent untuk membagikan informasi Mata Kuliah (Share Sheet)
export const shareCourse = async (courseName, lecturer) => {
  try {
    await Share.share({
      message: `Yuk cek mata kuliah ini: *${courseName}* dengan dosen pengampu *${lecturer}*. Sangat bermanfaat!`,
    });
  } catch (error) {
    Alert.alert('Error', 'Gagal membagikan data.');
  }
};