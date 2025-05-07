import apiClient from './apiClient';

interface SpecialityResponse {
  specialities: any[]; // Replace 'any' with the actual speciality type if available
  totalPages: number;
  totalItems: number;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export const fetchSpecialities = async (
  page: number,
  limit: number,
  sortBy: string = 'spec_code',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<SpecialityResponse> => {
  const response = await apiClient.get<SpecialityResponse>(
    `/speciality?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllSpecialities = async (
): Promise<SpecialityResponse> => {
  const response = await apiClient.get<SpecialityResponse>(
    `/speciality/all`
  );
  return response.data;
};

export const deleteSpeciality = async (specialityId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/speciality/${specialityId}`);
  return response.data;
};

export const updateSpeciality = async (specialityId: number, specName: string): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/speciality/${specialityId}`, { spec_name: specName });
  return response.data;
};

export const createSpeciality = async (specName: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/speciality`, { spec_name: specName });
  return response.data;
};