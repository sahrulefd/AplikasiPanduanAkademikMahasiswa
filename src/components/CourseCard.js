// src/components/CourseCard.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CourseCard = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardIndicator} />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.courseCode}>{course.code}</Text>
          <View style={styles.sksBadge}>
            <Text style={styles.sksText}>{course.sks} SKS</Text>
          </View>
        </View>
        
        <Text style={styles.courseName} numberOfLines={2}>
          {course.name}
        </Text>
        
        <Text style={styles.lecturerName} numberOfLines={1}>
          👤 {course.lecturer}
        </Text>
        
        <View style={styles.footerRow}>
          <View style={styles.semesterBadge}>
            <Text style={styles.semesterText}>Semester {course.semester}</Text>
          </View>
          <Text style={styles.actionText}>Lihat Detail →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    // Modern Floating Shadow
    elevation: 3,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardIndicator: {
    width: 6,
    backgroundColor: '#6750A4', // Warna aksen vertikal di kiri kartu
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6750A4',
    letterSpacing: 0.5,
    backgroundColor: '#F3EDF7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sksBadge: {
    backgroundColor: '#EADDFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sksText: {
    color: '#21005D',
    fontSize: 11,
    fontWeight: '700',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1B20',
    lineHeight: 22,
    marginBottom: 6,
  },
  lecturerName: {
    fontSize: 13,
    color: '#49454F',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F4EFF4',
    paddingTop: 10,
  },
  semesterBadge: {
    backgroundColor: '#E8DEF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  semesterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#49454F',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6750A4',
  },
});

export default CourseCard;