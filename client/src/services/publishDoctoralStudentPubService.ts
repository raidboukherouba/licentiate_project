import apiClient from './apiClient';

// Response types
interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Assign a doctoral student to a publication
 * @param reg_num - Doctoral Student registration number
 * @param doi - Publication DOI
 */
export const assignDoctoralStudentToPublication = async (
  reg_num: number,
  doi: string
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>(
      '/publish-doctoral-student-pub',
      { reg_num, doi }
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to assign doctoral student to publication' 
    };
  }
};

/**
 * Remove a doctoral student from a publication
 * @param reg_num - Doctoral Student registration number
 * @param doi - Publication DOI
 */
export const removeDoctoralStudentFromPublication = async (
  reg_num: number,
  doi: string
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const encodedDoi = encodeURIComponent(doi); // Encode DOI
    const response = await apiClient.delete<MessageResponse>(
      `/publish-doctoral-student-pub/${reg_num}/${encodedDoi}`
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to remove doctoral student from publication' 
    };
  }
};
