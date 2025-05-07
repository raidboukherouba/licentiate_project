import apiClient from './apiClient';

// Researcher type
interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
  res_prof_email: string;
}

// DoctoralStudent type
interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
  doc_stud_prof_email: string;
}

// ProductionType type
interface ProductionType {
  type_id: number;
  type_name: string;
}

// Core Communication type (without associations)
interface Communication {
  id_comm: number;
  title_comm: string;
  event_title: string;
  year_comm: number;
  url_comm: string | null;
  type_id: number;
  Researchers?: Researcher[];
  DoctoralStudents?: DoctoralStudent[];
}

// Communication with associations
interface CommunicationWithAssociations extends Communication {
  production_type?: ProductionType;
}

// Response types
interface CommunicationsResponse {
  communications: CommunicationWithAssociations[];
  totalPages: number;
  totalItems: number;
}

interface SingleCommunicationResponse {
  communication: CommunicationWithAssociations;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Fetch all communications with pagination, sorting, and search
 * @param includeAssociations - Whether to include associated data (default: true)
 */
export const fetchCommunications = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'year_comm',
  order: 'asc' | 'desc' = 'desc',
  search: string = '',
  laboratoryCode?: number | null,
  includeAssociations: boolean = true
): Promise<CommunicationsResponse> => {
  const params: Record<string, string | number | boolean> = {
    page,
    limit,
    sortBy,
    order,
    search: encodeURIComponent(search),
    includeAssociations,
  };

  // Add laboratoryCode to the query parameters if it is provided
  if (laboratoryCode !== undefined && laboratoryCode !== null) {
    params.laboratoryCode = laboratoryCode;
  }

  const response = await apiClient.get<CommunicationsResponse>('/communication', {
    params,
  });
  return response.data;
};


/**
 * Create a new communication
 */
export const createCommunication = async (
  communicationData: {
    title_comm: string;
    event_title: string;
    year_comm: number;
    type_id: number;
    url_comm?: string | null;
  }
): Promise<SingleCommunicationResponse | ErrorResponse> => {
  const response = await apiClient.post<SingleCommunicationResponse | ErrorResponse>('/communication', {
    ...communicationData,
    url_comm: communicationData.url_comm || undefined
  });
  return response.data;
};

/**
 * Update an existing communication
 */
export const updateCommunication = async (
  idComm: number,
  communicationData: {
    title_comm?: string;
    event_title?: string;
    year_comm?: number;
    type_id?: number;
    url_comm?: string | null;
  }
): Promise<SingleCommunicationResponse | ErrorResponse> => {
  const response = await apiClient.put<SingleCommunicationResponse | ErrorResponse>(
    `/communication/${idComm}`,
    communicationData
  );
  return response.data;
};

/**
 * Delete a communication by ID
 */
export const deleteCommunication = async (idComm: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/communications/${idComm}`);
  return response.data;
};

/**
 * Get a communication by ID
 * @param includeAssociations - Whether to include associated data (default: true)
 */
export const fetchCommunicationById = async (
  idComm: number,
  includeAssociations: boolean = true
): Promise<SingleCommunicationResponse> => {
  const response = await apiClient.get<SingleCommunicationResponse>(
    `/communication/${idComm}?includeAssociations=${includeAssociations}`
  );
  return response.data;
};

/**
 * Export communications to Excel
 */
export const exportCommunications = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/communications', {
    responseType: 'blob', // Important for handling file downloads
  });

  return response.data;
};