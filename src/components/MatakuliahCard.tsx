import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, User, ChevronRight } from 'lucide-react-native';
import { Matakuliah } from '../context/AcademicContext';

interface CardProps {
  item: Matakuliah;
  onPress: () => void;
}

export const MatakuliahCard: React.FC<CardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <BookOpen color="#4F46E5" size={22} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.nama}</Text>
        <Text style={styles.code}>{item.kode} • {item.sks} SKS</Text>
        <View style={styles.dosenRow}>
          <User color="#64748B" size={14} />
          <Text style={styles.dosenText}>{item.dosen}</Text>
        </View>
      </View>
      <ChevronRight color="#CBD5E1" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#EEF2F6',
    padding: 10,
    borderRadius: 10,
    marginRight: 14,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  code: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  dosenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dosenText: {
    fontSize: 13,
    color: '#64748B',
  },
});