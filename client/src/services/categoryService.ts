import apiClient from './apiClient';

interface CategoryResponse {
  categories: any[]; // Replace 'any' with the actual category type if available
  totalPages: number;
  totalItems: number;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export const fetchCategories = async (
  page: number,
  limit: number,
  sortBy: string = 'cat_name',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<CategoryResponse> => {
  const response = await apiClient.get<CategoryResponse>(
    `/category?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllCategories = async (
): Promise<CategoryResponse> => {
  const response = await apiClient.get<CategoryResponse>(
    `/category/all`
  );
  return response.data;
};

export const deleteCategory = async (categoryId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/category/${categoryId}`);
  return response.data;
};

export const updateCategory = async (categoryId: number, categoryName: string): Promise<MessageResponse> => {
  const response = await apiClient.put<MessageResponse>(`/category/${categoryId}`, { cat_name: categoryName });
  return response.data;
};

export const createCategory = async (categoryName: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(`/category`, { cat_name: categoryName });
  return response.data;
};