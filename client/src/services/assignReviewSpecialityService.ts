import apiClient from './apiClient';

// Response types
interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Create a new speciality assignment
 * @param review_num - Review ID
 * @param spec_id_review - Speciality ID
 */
export const createHasSpeciality = async (
  review_num: number,
  spec_id_review: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>(
      '/has-speciality',
      { review_num, spec_id_review }
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to assign speciality' 
    };
  }
};

/**
 * Delete a speciality assignment
 * @param review_num - Review ID
 * @param spec_id_review - Speciality ID
 */
export const deleteHasSpeciality = async (
  review_num: number,
  spec_id_review: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.delete<MessageResponse>(
      `/has-speciality/${review_num}/${spec_id_review}`
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to remove speciality assignment' 
    };
  }
};