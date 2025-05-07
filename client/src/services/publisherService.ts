import apiClient from './apiClient';

interface PublisherResponse {
  publishers: any[]; // Replace 'any' with the actual publisher type if available
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
 * Fetch all publishers with pagination, sorting, and search
 */
export const fetchPublishers = async (
  page: number,
  limit: number,
  sortBy: string = 'publisher_id',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<PublisherResponse> => {
  const response = await apiClient.get<PublisherResponse>(
    `/publisher?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllPublishers = async (
): Promise<PublisherResponse> => {
  const response = await apiClient.get<PublisherResponse>(
    `/publisher/all`
  );
  return response.data;
};

/**
 * Create a new publisher
 */
export const createPublisher = async (
  publisherName: string,
  country?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>(`/publisher`, {
    publisher_name: publisherName,
    country: country || undefined,
  });
  return response.data;
};

/**
 * Update an existing publisher
 */
export const updatePublisher = async (
  publisherId: number,
  publisherName: string,
  country?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/publisher/${publisherId}`, {
    publisher_name: publisherName,
    country: country || undefined,
  });
  return response.data;
};

/**
 * Delete a publisher by ID
 */
export const deletePublisher = async (publisherId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/publisher/${publisherId}`);
  return response.data;
};