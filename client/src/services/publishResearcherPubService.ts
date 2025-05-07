import apiClient from './apiClient';

// Response types
interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Create a new publication assignment
 * @param res_code - Researcher ID
 * @param doi - Publication DOI
 */
export const assignResearcherToPublication = async (
    res_code: number,
    doi: string
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>(
      '/publish-researcher-pub',
      { res_code, doi }
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to assign researcher to publication' 
    };
  }
};

/**
 * Delete a publication assignment
 * @param res_code - Researcher ID
 * @param doi - Publication DOI
 */
export const removeResearcherFromPublication = async (
    res_code: number,
    doi: string
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const encodedDoi = encodeURIComponent(doi); // Encode DOI
    const response = await apiClient.delete<MessageResponse>(
      `/publish-researcher-pub/${res_code}/${encodedDoi}`
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to remove researcher from publication' 
    };
  }
};