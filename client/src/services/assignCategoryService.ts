import apiClient from './apiClient';

// Response types
interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Assign a category to a review
 * @param review_num - Review ID
 * @param cat_id - Category ID
 */
export const assignReviewCategory = async (
  review_num: number,
  cat_id: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>(
      '/has-category',
      { review_num, cat_id }
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to assign category' 
    };
  }
};

/**
 * Remove a category assignment from a review
 * @param review_num - Review ID
 * @param cat_id - Category ID
 */
export const removeReviewCategory = async (
  review_num: number,
  cat_id: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.delete<MessageResponse>(
      `/has-category/${review_num}/${cat_id}`
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to remove category assignment' 
    };
  }
};