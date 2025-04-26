import api from '../api';

export interface Review {
  id: number;
  student_id: number;
  teacher_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string | null;
}

export interface ReviewData {
  teacher_id: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdateData {
  rating?: number;
  comment?: string;
}

/**
 * Create a review for a teacher
 */
export const createReview = async (data: ReviewData): Promise<Review> => {
  const response = await api.post<Review>('/api/reviews/', data);
  return response.data;
};

/**
 * Get all reviews for a teacher
 */
export const getTeacherReviews = async (teacherId: number): Promise<Review[]> => {
  const response = await api.get<Review[]>(`/api/teachers/${teacherId}/reviews`);
  return response.data;
};

/**
 * Get a specific review
 */
export const getReviewById = async (reviewId: number): Promise<Review> => {
  const response = await api.get<Review>(`/api/reviews/${reviewId}`);
  return response.data;
};

/**
 * Update a review
 */
export const updateReview = async (
  reviewId: number,
  data: ReviewUpdateData
): Promise<Review> => {
  const response = await api.patch<Review>(`/api/reviews/${reviewId}`, data);
  return response.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/api/reviews/${reviewId}`);
};

/**
 * Get all reviews by current student
 */
export const getStudentReviews = async (): Promise<Review[]> => {
  const response = await api.get<Review[]>('/api/students/me/reviews');
  return response.data;
};
