import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a simple storage interface
interface SimpleStorage {
  set(key: string, value: string | number | boolean): void;
  getString(key: string): string | undefined;
  delete(key: string): void;
}

const createMMKVInstance = (): SimpleStorage => {
  try {
    // Dynamically require to avoid crash on import in Expo Go
    const { MMKV } = require('react-native-mmkv');
    return new MMKV();
  } catch (error) {
    console.warn('MMKV native module not found, falling back to AsyncStorage in-memory cache.');
    
    // In-memory fallback
    const memoryStore = new Map<string, string>();
    const HYDRATION_KEY_PREFIX = '@mmkv_fallback:';
    
    // Hydrate memoryStore from AsyncStorage asynchronously on startup
    AsyncStorage.getAllKeys()
      .then(keys => {
        const targetKeys = keys.filter(k => k.startsWith(HYDRATION_KEY_PREFIX));
        return AsyncStorage.multiGet(targetKeys);
      })
      .then(stores => {
        stores.forEach(([key, val]) => {
          if (val !== null) {
            const actualKey = key.substring(HYDRATION_KEY_PREFIX.length);
            memoryStore.set(actualKey, val);
          }
        });
      })
      .catch(err => console.error('Error hydrating MMKV fallback:', err));

    return {
      set: (key: string, value: string | number | boolean) => {
        const strVal = String(value);
        memoryStore.set(key, strVal);
        AsyncStorage.setItem(`${HYDRATION_KEY_PREFIX}${key}`, strVal).catch(err => 
          console.error(`Error saving fallback key ${key}:`, err)
        );
      },
      getString: (key: string) => {
        return memoryStore.get(key);
      },
      delete: (key: string) => {
        memoryStore.delete(key);
        AsyncStorage.removeItem(`${HYDRATION_KEY_PREFIX}${key}`).catch(err =>
          console.error(`Error deleting fallback key ${key}:`, err)
        );
      }
    };
  }
};

export const mmkvStorage = createMMKVInstance();

// MMKV: Caching Data Cepat (Mata Kuliah)
export const cacheData = (key: string, value: any): void => {
  try {
    mmkvStorage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error caching data via MMKV for key: ${key}`, error);
  }
};

export const getCachedData = (key: string): any => {
  try {
    const data = mmkvStorage.getString(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing cached data for key: ${key}`, error);
    return null;
  }
};

export const removeCachedData = (key: string): void => {
  try {
    mmkvStorage.delete(key);
  } catch (error) {
    console.error(`Error deleting MMKV data for key: ${key}`, error);
  }
};

// =======================================================================
// AsyncStorage: Data Persistence Aman (User Profile & App Settings)
export const saveSecureData = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving secure data to AsyncStorage for key: ${key}`, error);
  }
};

export const getSecureData = async (key: string): Promise<any> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading data from AsyncStorage for key: ${key}`, error);
    return null;
  }
};

export const removeSecureData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing secure data for key: ${key}`, error);
  }
};