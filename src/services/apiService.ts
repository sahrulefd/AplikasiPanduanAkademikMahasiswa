// ============================================================
// API SERVICE — Modul Networking Terpusat (Axios)
// Menangani semua komunikasi HTTP ke backend/server
// ============================================================

import axios, { AxiosInstance, AxiosError } from 'axios';

// Interface untuk data mata kuliah dari server (JSONPlaceholder)
interface ServerPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Interface Course yang sesuai dengan AppContext
export interface ServerCourse {
  id: string;
  name: string;
  code: string;
  sks: number;
  dosen: string;
  notes?: string;
  email?: string;
  phone?: string;
  description?: string;
  location?: string;
  fromServer?: boolean; // Penanda data berasal dari server
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Daftar nama dosen simulasi untuk transformasi data
const DOSEN_NAMES = [
  'Dr. Ahmad Fauzi, M.Kom.',
  'Prof. Siti Rahayu, M.T.',
  'Ir. Budi Santoso, M.Sc.',
  'Dr. Dewi Kartika, S.T., M.T.',
  'Rina Wulandari, M.Kom.',
  'Dr. Hendra Wijaya, M.Cs.',
  'Fitri Handayani, S.Kom., M.Kom.',
  'Dr. Agus Prasetyo, M.Eng.',
  'Nurul Hidayah, M.T.',
  'Dr. Bambang Irawan, M.Kom.',
];

// Daftar kode mata kuliah simulasi
const COURSE_CODES = [
  'TI-40501', 'TI-40502', 'TI-40503', 'TI-40504', 'TI-40505',
  'TI-40506', 'TI-40507', 'TI-40508', 'TI-40509', 'TI-40510',
];

// ============================================================
// 1. AXIOS INSTANCE — Konfigurasi base URL, timeout, headers
// ============================================================
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000, // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================================
// 2. RETRY INTERCEPTOR — Otomatis retry 2x jika request gagal
// ============================================================
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response) => {
    retryCount = 0; // Reset counter jika berhasil
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config;
    if (!config || retryCount >= MAX_RETRIES) {
      retryCount = 0;
      return Promise.reject(error);
    }

    retryCount += 1;
    console.log(`[API] Retry attempt ${retryCount}/${MAX_RETRIES}...`);
    
    // Delay sebelum retry (exponential backoff sederhana)
    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
    
    return apiClient(config);
  }
);

// ============================================================
// 3. TRANSFORM — Mengubah data JSONPlaceholder ke format Course
// ============================================================
const transformPostToCourse = (post: ServerPost): ServerCourse => {
  const index = (post.id - 1) % 10;
  return {
    id: `server_${post.id}`,
    name: post.title.length > 40 
      ? post.title.substring(0, 40).replace(/\b\w/g, l => l.toUpperCase()) 
      : post.title.replace(/\b\w/g, l => l.toUpperCase()),
    code: COURSE_CODES[index] || `TI-4${String(post.id).padStart(4, '0')}`,
    sks: (index % 3) + 2, // SKS antara 2-4
    dosen: DOSEN_NAMES[index] || 'Dosen Pengampu',
    notes: '',
    email: `dosen${post.id}@uir.ac.id`,
    phone: `+62812${String(post.id).padStart(8, '0')}`,
    description: post.body,
    location: 'Fakultas Teknik UIR, Pekanbaru',
    fromServer: true,
    coordinates: {
      latitude: -0.4545 + (index * 0.001),
      longitude: 101.4485 + (index * 0.001),
    },
  };
};

// ============================================================
// 4. FETCH — Ambil daftar mata kuliah dari server
// ============================================================
export const fetchCoursesFromServer = async (): Promise<{
  success: boolean;
  data: ServerCourse[];
  error?: string;
}> => {
  try {
    console.log('[API] Fetching courses from server...');
    const response = await apiClient.get<ServerPost[]>('/posts', {
      params: { _limit: 10 }, // Batasi 10 data saja
    });

    const courses = response.data.map(transformPostToCourse);
    console.log(`[API] Successfully fetched ${courses.length} courses`);
    
    return {
      success: true,
      data: courses,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response
      ? `Server error: ${axiosError.response.status}`
      : axiosError.code === 'ECONNABORTED'
        ? 'Request timeout — server tidak merespon'
        : 'Gagal terhubung ke server. Periksa koneksi internet Anda.';

    console.error('[API] Fetch error:', errorMessage);
    
    return {
      success: false,
      data: [],
      error: errorMessage,
    };
  }
};

// ============================================================
// 5. POST — Kirim mata kuliah baru ke server (simulasi)
// ============================================================
export const postCourseToServer = async (course: {
  name: string;
  code: string;
  sks: string | number;
  dosen: string;
  notes?: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    console.log('[API] Posting new course to server...');
    const response = await apiClient.post('/posts', {
      title: course.name,
      body: `${course.code} | ${course.sks} SKS | Dosen: ${course.dosen} | ${course.notes || ''}`,
      userId: 1,
    });

    console.log('[API] Course posted successfully, server ID:', response.data.id);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response
      ? `Server error: ${axiosError.response.status}`
      : 'Gagal mengirim data ke server.';

    console.error('[API] Post error:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// ============================================================
// 6. HEALTH CHECK — Cek apakah server tersedia
// ============================================================
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await apiClient.get('/posts/1', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
