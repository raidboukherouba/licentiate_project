import apiClient from './apiClient';

// Define response and error types
interface ProductionTypeResponse {
  productionTypes: any[]; // Replace 'any' with the actual production type type if available
  totalPages: number;
  totalItems: number;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

// Fetch production types with pagination, sorting, and search
export const fetchProductionTypes = async (
  page: number,
  limit: number,
  sortBy: string = 'type_name',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<ProductionTypeResponse> => {
  const response = await apiClient.get<ProductionTypeResponse>(
    `/production-type?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllProductionTypes = async (
): Promise<ProductionTypeResponse> => {
  const response = await apiClient.get<ProductionTypeResponse>(
    `/production-type/all`
  );
  return response.data;
};

// Delete a production type by ID
export const deleteProductionType = async (typeId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/production-type/${typeId}`);
  return response.data;
};

// Update a production type by ID
export const updateProductionType = async (typeId: number, typeName: string): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/production-type/${typeId}`, { type_name: typeName });
  return response.data;
};

// Create a new production type
export const createProductionType = async (typeName: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/production-type`, { type_name: typeName });
  return response.data;
};