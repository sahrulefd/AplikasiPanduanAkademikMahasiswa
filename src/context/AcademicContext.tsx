import React, { createContext, useState, useEffect, useContext } from 'react';
import { cacheData, getCachedData, saveSecureData, getSecureData } from '../services/storage';

export interface Matakuliah {
  id: string;
  nama: string;
  kode: string;
  sks: number;
  dosen: string;
  catatan: string;
}

export interface StudentProfile {
  nim: string;
  nama: string;
  semester: string;
}

interface AcademicContextType {
  profile: StudentProfile;
  matakuliahList: Matakuliah[];
  isLoading: boolean;
  isDarkMode: boolean;
  updateProfile: (profile: StudentProfile) => Promise<void>;
  addMatakuliah: (mk: Omit<Matakuliah, 'id'>) => void;
  updateMatakuliah: (id: string, updatedMk: Partial<Matakuliah>) => void;
  deleteMatakuliah: (id: string) => void;
  toggleDarkMode: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>({ nim: '233510312', nama: 'Sahrul Efendi', semester: '6' });
  const [matakuliahList, setMatakuliahList] = useState<Matakuliah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      // Load Profile & Settings dari AsyncStorage
      const savedProfile = await getSecureData('user_profile');
      const savedSettings = await getSecureData('app_settings');
      if (savedProfile) setProfile(savedProfile);
      if (savedSettings) setIsDarkMode(savedSettings.darkMode);

      // Load Caching Matakuliah dari MMKV (Fast Load)
      const cachedMk = getCachedData('matakuliah_cache');
      if (cachedMk) setMatakuliahList(cachedMk);
      
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  const updateProfile = async (newProfile: StudentProfile) => {
    setProfile(newProfile);
    await saveSecureData('user_profile', newProfile);
  };

  const addMatakuliah = (mk: Omit<Matakuliah, 'id'>) => {
    const newMk = { ...mk, id: Date.now().toString() };
    const updated = [...matakuliahList, newMk];
    setMatakuliahList(updated);
    cacheData('matakuliah_cache', updated); // Update MMKV Cache
  };

  const updateMatakuliah = (id: string, updatedMk: Partial<Matakuliah>) => {
    const updated = matakuliahList.map(mk => mk.id === id ? { ...mk, ...updatedMk } : mk);
    setMatakuliahList(updated);
    cacheData('matakuliah_cache', updated);
  };

  const deleteMatakuliah = (id: string) => {
    const updated = matakuliahList.filter(mk => mk.id !== id);
    setMatakuliahList(updated);
    cacheData('matakuliah_cache', updated);
  };

  const toggleDarkMode = async () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    await saveSecureData('app_settings', { darkMode: nextMode });
  };

  return (
    <AcademicContext.Provider value={{
      profile, matakuliahList, isLoading, isDarkMode,
      updateProfile, addMatakuliah, updateMatakuliah, deleteMatakuliah, toggleDarkMode
    }}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) throw new Error('useAcademic must be used within AcademicProvider');
  return context;
};