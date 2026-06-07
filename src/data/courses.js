// src/data/courses.js

const COURSES_DATA = [
  {
    id: '1',
    code: 'TI-23351',
    name: 'Pemrograman Mobile',
    sks: 3,
    semester: 4,
    lecturer: 'ramdan, M.Kom.',
    email: 'ramdan@uir.ac.id',
    phone: '+6281234567890', // Ganti dengan nomor WhatsApp valid untuk testing
    description: 'Mata kuliah ini membahas mengenai pengembangan aplikasi perangkat bergerak menggunakan React Native dengan fokus pada komponen navigasi, state management, dan integrasi dengan API atau native features.',
    location: 'Gedung Fakultas Teknik UIR, Ruang 302',
    coordinates: {
      latitude: -0.4545, // Contoh koordinat, bisa disesuaikan dengan UIR
      longitude: 101.4485
    }
  },
  {
    id: '2',
    code: 'TI-23352',
    name: 'Keamanan Komputer & Jaringan',
    sks: 3,
    semester: 4,
    lecturer: 'diki, M.T.',
    email: 'diki@uir.ac.id',
    phone: '+6289876543210',
    description: 'Mempelajari konsep keamanan jaringan komputer, konfigurasi firewall, serta implementasi Intrusion Detection System (IDS) menggunakan Snort untuk mendeteksi ancaman secara real-time.',
    location: 'Laboratorium Jaringan & Komputer UIR',
    coordinates: {
      latitude: -0.4550,
      longitude: 101.4490
    }
  },
  {
    id: '3',
    code: 'TI-23353',
    name: 'Kecerdasan Buatan',
    sks: 3,
    semester: 4,
    lecturer: 'salsabila, M.Kom.',
    email: 'salsabila@uir.ac.id',
    phone: '+6285211223344',
    description: 'Membahas teknik-teknik kecerdasan buatan, machine learning (regresi dan clustering), pemrosesan bahasa alami (NLP) untuk sentiment analysis, hingga pengenalan Graph RAG menggunakan Neo4j.',
    location: 'Gedung Kuliah Bersama UIR, Ruang 105',
    coordinates: {
      latitude: -0.4540,
      longitude: 101.4480
    }
  }
];

export default COURSES_DATA;