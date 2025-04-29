import api from '../api';

export interface Subject {
  id: number;
  teacher_id: number;
  name: string;
  description: string;
  hourly_rate: number;
}

export interface Review {
  id: number;
  student_id: number;
  teacher_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string | null;
  student_name?: string;  // Added student_name field
}

export interface TeacherProfile {
  id: number;
  user_id: number;
  username?: string;  // Added username field
  profile_picture?: string;
  short_description?: string;
  long_description?: string;
  years_of_experience?: number;
  education?: string | Education[];
  certifications?: string | Certification[];
  teaching_philosophy?: string;
  achievements?: string;
  average_rating?: number;
  total_reviews?: number;
  subjects?: Subject[];
  reviews?: Review[];
  teaching_experience?: string[];
  availability?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface TeacherUpdateData {
  profile_picture?: string;
  bio?: string;
  short_description?: string;
  long_description?: string;
  years_of_experience?: number;
  teaching_experience?: string[];
  education?: Education[];
  certifications?: Certification[];
  teaching_philosophy?: string;
  achievements?: string;
  subjects?: { name: string; description: string; hourly_rate: number }[];
  availability?: string[];
}

export interface SubjectData {
  name: string;
  description: string;
  hourly_rate: number;
}

export interface TeacherCountResponse {
  total: number;
}

/**
 * Get current teacher profile
 */
export const getCurrentTeacherProfile = async (): Promise<TeacherProfile> => {
  const response = await api.get<TeacherProfile>('/api/teachers/teachers/profile');
  return response.data;
};

/**
 * Update teacher profile
 */
export const updateTeacherProfile = async (
  data: TeacherUpdateData,
  profilePicture?: File | null
): Promise<TeacherProfile> => {
  // Create a copy of the data to modify
  const profileData = { ...data };

  // If a profile picture is provided, upload it first
  if (profilePicture) {
    try {
      const pictureResponse = await uploadTeacherProfilePicture(profilePicture);
      // Add the profile picture URL to the data
      profileData.profile_picture = pictureResponse.url;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Continue even if profile picture upload fails
    }
  }

  // Update the profile data with the correct endpoint
  const response = await api.patch<TeacherProfile>('/api/teachers/teachers/profile', profileData);
  return response.data;
};

/**
 * Upload teacher profile picture
 */
export const uploadTeacherProfilePicture = async (
  file: File
): Promise<{ filename: string; content_type: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ filename: string; content_type: string; url: string }>(
    '/api/teachers/teachers/me/profile-picture',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Add a subject
 */
export const addSubject = async (data: SubjectData): Promise<Subject> => {
  const response = await api.post<Subject>('/api/teachers/teachers/me/subjects', data);
  return response.data;
};

/**
 * Get teacher's subjects
 */
export const getTeacherSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<Subject[]>('/api/teachers/teachers/me/subjects');
  return response.data;
};

/**
 * Get all teachers
 */
export const getAllTeachers = async (
  params?: {
    name?: string;
    subject?: string;
    min_hourly_rate?: number;
    max_hourly_rate?: number;
    years_of_experience?: number;
    min_rating?: number;
    education?: string;
    certifications?: string;
    keyword?: string;
    sort_by?: 'rating' | 'experience';
    sort_order?: 'asc' | 'desc';
    skip?: number;
    limit?: number;
  }
): Promise<TeacherProfile[]> => {
  const response = await api.get<TeacherProfile[]>('/api/teachers/teachers', { params });
  return response.data;
};

/**
 * Get teacher count
 */
export const getTeacherCount = async (
  params?: {
    name?: string;
    subject?: string;
    min_hourly_rate?: number;
    max_hourly_rate?: number;
    years_of_experience?: number;
    min_rating?: number;
    education?: string;
    certifications?: string;
    keyword?: string;
  }
): Promise<TeacherCountResponse> => {
  const response = await api.get<TeacherCountResponse>('/api/teachers/teachers/count', { params });
  return response.data;
};

/**
 * Get a specific teacher
 */
export const getTeacherById = async (teacherId: number): Promise<TeacherProfile> => {
  const response = await api.get<TeacherProfile>(`/api/teachers/teachers/${teacherId}`);
  return response.data;
};
