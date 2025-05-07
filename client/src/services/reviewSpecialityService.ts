import apiClient from './apiClient';

interface ReviewSpeciality {
  spec_id_review: number;
  spec_name_review: string;
}

interface ReviewSpecialityResponse {
  reviewSpecialities: ReviewSpeciality[]; // Replace 'any' with the actual review speciality type if available
  totalPages: number;
  totalItems: number;
}

interface AllSpecialitiesResponse {
  reviewSpecialities: ReviewSpeciality[];
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Fetches review specialities with pagination, sorting, and search.
 */
export const fetchReviewSpecialities = async (
  page: number,
  limit: number,
  sortBy: string = 'spec_name_review',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<ReviewSpecialityResponse> => {
  const response = await apiClient.get<ReviewSpecialityResponse>(
    `/review-speciality?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllReviewSpecialities = async (
): Promise<AllSpecialitiesResponse> => {
  const response = await apiClient.get<AllSpecialitiesResponse>(
    `/review-speciality/all`
  );
  return response.data;
};

/**
 * Deletes a review speciality by ID.
 */
export const deleteReviewSpeciality = async (
  specId: number
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(
    `/review-speciality/${specId}`
  );
  return response.data;
};

/**
 * Updates a review speciality by ID.
 */
export const updateReviewSpeciality = async (
  specId: number,
  specName: string
): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/review-speciality/${specId}`, {
    spec_name_review: specName,
  });
  return response.data;
};

/**
 * Creates a new review speciality.
 */
export const createReviewSpeciality = async (
  specName: string
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/review-speciality`, {
    spec_name_review: specName,
  });
  return response.data;
};