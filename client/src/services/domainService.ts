import apiClient from './apiClient';

interface DomainResponse {
  domains: any[]; // Replace 'any' with the actual domain type if available
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
 * Fetch all domains with pagination, sorting, and search
 */
export const fetchDomains = async (
  page: number,
  limit: number,
  sortBy: string = 'domain_id',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<DomainResponse> => {
  const response = await apiClient.get<DomainResponse>(
    `/domain?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllDomains = async (): Promise<DomainResponse> => {
  const response = await apiClient.get<DomainResponse>(
    `/domain/all`
  );
  return response.data;
};

/**
 * Create a new domain
 */
export const createDomain = async (domainName: string, domainAbbr?: string): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>(`/domain`, {
    domain_name: domainName,
    domain_abbr: domainAbbr || undefined,
  });
  return response.data;
};

/**
 * Update an existing domain
 */
export const updateDomain = async (
  domainId: number,
  domainName: string,
  domainAbbr?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/domain/${domainId}`, {
    domain_name: domainName,
    domain_abbr: domainAbbr || undefined,
  });
  return response.data;
};

/**
 * Delete a domain by ID
 */
export const deleteDomain = async (domainId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/domain/${domainId}`);
  return response.data;
};