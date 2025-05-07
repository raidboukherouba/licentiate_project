import apiClient from './apiClient';

// Response types
interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Create a new communication assignment
 * @param res_code - Researcher ID
 * @param id_comm - Communicaion ID
 */
export const assignResearcherToCommunication = async (
    res_code: number,
    id_comm: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>(
      '/publish-researcher-comm',
      { res_code, id_comm }
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to assign researcher to communication' 
    };
  }
};

/**
 * Delete a communication assignment
 * @param res_code - Researcher ID
 * @param id_comm - Communicaion ID
 */
export const removeResearcherFromCommunication = async (
    res_code: number,
    id_comm: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.delete<MessageResponse>(
      `/publish-researcher-comm/${res_code}/${id_comm}`
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to remove researcher from communication' 
    };
  }
};