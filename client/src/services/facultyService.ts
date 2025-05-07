import apiClient from './apiClient';

interface FacultyResponse {
  faculties: any[]; // Replace 'any' with the actual faculty type if available
  totalPages: number;
  totalItems: number;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export const fetchFaculties = async (
  page: number,
  limit: number,
  sortBy: string = 'faculty_name',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<FacultyResponse> => {
  const response = await apiClient.get<FacultyResponse>(
    `/faculty?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllFaculties = async (
): Promise<FacultyResponse> => {
  const response = await apiClient.get<FacultyResponse>(
    `/faculty/all`
  );
  return response.data;
};

export const deleteFaculty = async (facultyId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/faculty/${facultyId}`);
  return response.data;
};

export const updateFaculty = async (facultyId: number, facultyName: string): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/faculty/${facultyId}`, { faculty_name: facultyName });
  return response.data;
};

export const createFaculty = async (facultyName: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/faculty`, { faculty_name: facultyName });
  return response.data;
};
