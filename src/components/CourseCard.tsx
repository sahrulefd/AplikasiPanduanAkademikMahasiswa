import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { User, ChevronRight } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';

// Definisikan tipe data props untuk keamanan TypeScript
interface CourseData {
  id: string;
  code: string;
  sks: string | number;
  name: string;
  dosen: string;
  semester?: string | number;
  notes?: string;
}

interface CourseCardProps {
  course: CourseData;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  // Ambil state tema dan data mahasiswa dari context
  const { isDarkMode, mahasiswa } = context as any;

  // 1. Baca bahasa aktif dari global context mahasiswa (default: 'id')
  const currentLanguage = mahasiswa?.language || 'id';

  // 2. Kamus Terjemahan Kecil khusus Komponen Kartu
  const textContent = {
    id: {
      sksLabel: 'SKS',
      semesterLabel: 'Semester',
      actionText: 'Lihat Detail'
    },
    en: {
      sksLabel: 'Credits',
      semesterLabel: 'Semester',
      actionText: 'View Details'
    }
  };

  const t = textContent[currentLanguage as 'id' | 'en'];

  return (
    <TouchableOpacity 
      style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* Garis Aksen Vertikal Modern */}
      <View style={[styles.cardIndicator, isDarkMode ? styles.indicatorDark : styles.indicatorLight]} />
      
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={[styles.courseCode, isDarkMode ? styles.codeDark : styles.codeLight]}>
            <Text style={[styles.codeText, isDarkMode ? styles.textAccentDark : styles.textAccentLight]}>
              {course.code}
            </Text>
          </View>
          <View style={[styles.sksBadge, isDarkMode ? styles.sksBadgeDark : styles.sksBadgeLight]}>
            <Text style={[styles.sksText, isDarkMode ? styles.textDark : { color: '#21005D' }]}>
              {course.sks} {t.sksLabel}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.courseName, isDarkMode ? styles.textDark : styles.textLight]} numberOfLines={2}>
          {course.name}
        </Text>
        
        {/* Row Dosen Pengampu dengan Lucide Icons */}
        <View style={styles.lecturerRow}>
          <User color={isDarkMode ? '#94A3B8' : '#64748B'} size={14} />
          <Text style={[styles.lecturerName, isDarkMode ? styles.textMutedDark : styles.textMutedLight]} numberOfLines={1}>
            {course.dosen}
          </Text>
        </View>
        
        <View style={[styles.footerRow, isDarkMode ? styles.footerRowDark : styles.footerRowLight]}>
          {/* Tampilkan badge semester hanya jika datanya tersedia */}
          <View style={[styles.semesterBadge, isDarkMode ? styles.semesterBadgeDark : styles.semesterBadgeLight]}>
            <Text style={[styles.semesterText, isDarkMode ? styles.textDark : { color: '#49454F' }]}>
              {t.semesterLabel} {course.semester || '6'}
            </Text>
          </View>
          
          <View style={styles.actionLink}>
            <Text style={[styles.actionText, isDarkMode ? styles.textAccentDark : styles.textAccentLight]}>
              {t.actionText}
            </Text>
            <ChevronRight color={isDarkMode ? '#6366F1' : '#4F46E5'} size={14} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  
  cardIndicator: {
    width: 5,
  },
  indicatorLight: { backgroundColor: '#4F46E5' },
  indicatorDark: { backgroundColor: '#6366F1' },

  cardContent: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  courseCode: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  codeLight: { backgroundColor: '#EEF2F6' },
  codeDark: { backgroundColor: '#334155' },

  sksBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sksBadgeLight: { backgroundColor: '#EADDFF' },
  sksBadgeDark: { backgroundColor: '#312E81' },
  sksText: { fontSize: 11, fontWeight: '700' },

  courseName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  lecturerName: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  footerRowLight: { borderTopColor: '#F1F5F9' },
  footerRowDark: { borderTopColor: '#334155' },

  semesterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  semesterBadgeLight: { backgroundColor: '#E8DEF8' },
  semesterBadgeDark: { backgroundColor: '#334155' },
  semesterText: { fontSize: 11, fontWeight: '600' },
  
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },

  textLight: { color: '#1E293B' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  textAccentLight: { color: '#4F46E5' },
  textAccentDark: { color: '#6366F1' },
});

export default CourseCard;