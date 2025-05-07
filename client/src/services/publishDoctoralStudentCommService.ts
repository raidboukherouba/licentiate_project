import apiClient from './apiClient';

// Response types
interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Assign a doctoral student to a communication
 * @param reg_num - Doctoral Student registration number
 * @param id_comm - Communication ID
 */
export const assignDoctoralStudentToCommunication = async (
  reg_num: number,
  id_comm: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>(
      '/publish-doctoral-student-comm',
      { reg_num, id_comm }
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to assign doctoral student to communication' 
    };
  }
};

/**
 * Remove a doctoral student from a communication
 * @param reg_num - Doctoral Student registration number
 * @param id_comm - Communication ID
 */
export const removeDoctoralStudentFromCommunication = async (
  reg_num: number,
  id_comm: number
): Promise<MessageResponse | ErrorResponse> => {
  try {
    const response = await apiClient.delete<MessageResponse>(
      `/publish-doctoral-student-comm/${reg_num}/${id_comm}`
    );
    return response.data;
  } catch (error: any) {
    return { 
      error: error.response?.data?.error || 'Failed to remove doctoral student from communication' 
    };
  }
};