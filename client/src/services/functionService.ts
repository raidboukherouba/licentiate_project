import apiClient from './apiClient';

interface FunctionResponse {
  functions: any[]; // Replace 'any' with the actual function type if available
  totalPages: number;
  totalItems: number;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Fetches a paginated list of functions with sorting and search capabilities.
*/
export const fetchFunctions = async (
  page: number = 1,
  limit: number = 8,
  sortBy: string = 'func_code',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<FunctionResponse> => {
  const response = await apiClient.get<FunctionResponse>(
    `/function?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllFunctions = async (
): Promise<FunctionResponse> => {
  const response = await apiClient.get<FunctionResponse>(
    `/function/all`
  );
  return response.data;
};

/**
 * Deletes a function by its ID.
*/
export const deleteFunction = async (functionId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/function/${functionId}`);
  return response.data;
};

/**
 * Updates a function's name by its ID.
*/
export const updateFunction = async (functionId: number, funcName: string): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/function/${functionId}`, { func_name: funcName });
  return response.data;
};

/**
 * Creates a new function.
*/
export const createFunction = async (funcName: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/function`, { func_name: funcName });
  return response.data;
};