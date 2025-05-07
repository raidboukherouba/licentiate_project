import apiClient from './apiClient';

interface DepartmentResponse {
  departments: any[]; // Replace 'any' with the actual department type if available
  totalPages: number;
  totalItems: number;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export const fetchDepartments = async (
  page: number,
  limit: number,
  sortBy: string = 'dept_name',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<DepartmentResponse> => {
  const response = await apiClient.get<DepartmentResponse>(
    `/department?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllDepartments = async (): Promise<DepartmentResponse> => {
  const response = await apiClient.get<DepartmentResponse>(
    `/department/all`
  );
  return response.data;
};

export const deleteDepartment = async (departmentId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/department/${departmentId}`);
  return response.data;
};

export const updateDepartment = async (departmentId: number, deptName: string): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/department/${departmentId}`, { dept_name: deptName });
  return response.data;
};

export const createDepartment = async (deptName: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/department`, { dept_name: deptName });
  return response.data;
};