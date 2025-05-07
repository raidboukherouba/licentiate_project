import apiClient from './apiClient';

// Define the Laboratory type
interface Laboratory {
  lab_code: number;
  lab_name: string;
  lab_abbr?: string | null;
  lab_desc?: string | null;
  lab_address?: string | null;
  lab_phone?: string | null;
  faculty_id: number;
  domain_id: number;
  dept_id: number;
}

// Define the response type for fetching multiple laboratories
interface LaboratoryResponse {
  laboratories: Laboratory[];
  totalPages: number;
  totalItems: number;
}

// Define the response type for a single laboratory
interface SingleLaboratoryResponse {
  laboratory: Laboratory;
}

// Define the response type for messages
interface MessageResponse {
  message: string;
}

// Define the response type for errors
interface ErrorResponse {
  error: string;
}

/**
 * Fetch all laboratories with pagination, sorting, search, and faculty filtering
 */
export const fetchLaboratories = async (
  page: number,
  limit: number,
  sortBy: string = 'lab_code',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  facultyId?: number | null // Add facultyId as an optional parameter
): Promise<LaboratoryResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    sortBy,
    order,
    search: encodeURIComponent(search),
  };

  // Add facultyId to the query parameters if it is provided
  if (facultyId !== undefined && facultyId !== null) {
    params.facultyId = facultyId;
  }

  const response = await apiClient.get<LaboratoryResponse>('/laboratory', {
    params,
  });
  return response.data;
};

export const fetchAllLaboratories = async (
): Promise<LaboratoryResponse> => {
  const response = await apiClient.get<LaboratoryResponse>(
    `/laboratory/all`
  );
  return response.data;
};

/**
 * Create a new laboratory
 */
export const createLaboratory = async (
  labName: string,
  facultyId: number,
  domainId: number,
  deptId: number,
  labAbbr?: string,
  labDesc?: string,
  labAddress?: string,
  labPhone?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/laboratory', {
    lab_name: labName,
    lab_abbr: labAbbr || undefined,
    lab_desc: labDesc || undefined,
    lab_address: labAddress || undefined,
    lab_phone: labPhone || undefined,
    faculty_id: facultyId,
    domain_id: domainId,
    dept_id: deptId,
  });
  return response.data;
};

/**
 * Update an existing laboratory
 */
export const updateLaboratory = async (
  labId: number,
  labName: string,
  facultyId: number,
  domainId: number,
  deptId: number,
  labAbbr?: string,
  labDesc?: string,
  labAddress?: string,
  labPhone?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/laboratory/${labId}`, {
    lab_name: labName,
    lab_abbr: labAbbr || undefined,
    lab_desc: labDesc || undefined,
    lab_address: labAddress || undefined,
    lab_phone: labPhone || undefined,
    faculty_id: facultyId,
    domain_id: domainId,
    dept_id: deptId,
  });
  return response.data;
};

/**
 * Delete a laboratory by ID
 */
export const deleteLaboratory = async (labId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/laboratory/${labId}`);
  return response.data;
};

/**
 * Get a laboratory by ID
 */
export const fetchLaboratoryById = async (labId: number): Promise<SingleLaboratoryResponse> => {
  const response = await apiClient.get<SingleLaboratoryResponse>(`/laboratory/${labId}`);
  return response.data;
};

/**
 * Export laboratories to Excel
 */
export const exportLaboratories = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/laboratories', {
    responseType: 'blob', // Important for handling file downloads
  });

  return response.data;
};