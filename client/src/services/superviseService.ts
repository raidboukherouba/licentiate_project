import apiClient from './apiClient';

// Define the Supervise type with expanded information from associations
interface Supervise {
  res_code: number;
  reg_num: number;
  super_start_date: string;
  super_end_date?: string | null;
  super_theme: string;
  Researcher?: {
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
    lab_code: number;
    laboratory?: {
      lab_name: string;
    };
  };
  DoctoralStudent?: {
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_prof_email: string;
  };
}

// Define the response type for fetching multiple supervises
interface SuperviseResponse {
  supervises: Supervise[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Define the response type for a single supervise
interface SingleSuperviseResponse {
  supervise: Supervise;
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
 * Fetch all supervises with pagination, sorting, search, and laboratory filtering
 */
export const fetchSupervises = async (
  page: number,
  limit: number,
  sortBy: string = 'res_code',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  labCode?: number | null
): Promise<SuperviseResponse> => {
  const params: Record<string, string | number | null | undefined> = {
    page,
    limit,
    sortBy,
    order,
    search: encodeURIComponent(search),
    labCode: labCode !== undefined ? labCode : undefined, // Only include if defined
  };

  // Remove undefined parameters
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  const response = await apiClient.get<SuperviseResponse>('/supervise', {
    params,
  });
  return response.data;
};

/**
 * Create a new supervise record
 */
export const createSupervise = async (
  resCode: number,
  regNum: number,
  superStartDate: Date | string,
  superTheme: string,
  superEndDate?: Date | string | null
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/supervise', {
    res_code: resCode,
    reg_num: regNum,
    super_start_date: typeof superStartDate === 'string' ? superStartDate : superStartDate.toISOString(),
    super_theme: superTheme,
    super_end_date: superEndDate 
      ? (typeof superEndDate === 'string' ? superEndDate : superEndDate.toISOString())
      : null,
  });
  return response.data;
};

/**
 * Update an existing supervise record
 */
export const updateSupervise = async (
  resCode: number,
  regNum: number,
  superStartDate: Date | string,
  superTheme: string,
  superEndDate?: Date | string | null
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(
    `/supervise/${resCode}/${regNum}`,
    {
      super_start_date: typeof superStartDate === 'string' ? superStartDate : superStartDate.toISOString(),
      super_theme: superTheme,
      super_end_date: superEndDate 
        ? (typeof superEndDate === 'string' ? superEndDate : superEndDate.toISOString())
        : null,
    }
  );
  return response.data;
};

/**
 * Delete a supervise record by composite key (res_code and reg_num)
 */
export const deleteSupervise = async (
  resCode: number,
  regNum: number
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(
    `/supervise/${resCode}/${regNum}`
  );
  return response.data;
};

/**
 * Get a supervise record by composite key (res_code and reg_num)
 */
export const fetchSuperviseById = async (
  resCode: number,
  regNum: number
): Promise<SingleSuperviseResponse> => {
  const response = await apiClient.get<SingleSuperviseResponse>(
    `/supervise/${resCode}/${regNum}`
  );
  return response.data;
};

/**
 * Export supervises to Excel with optional filters
 */
export const exportSupervises = async (
  search?: string,
  labCode?: number
): Promise<Blob> => {
  const params: Record<string, string | number | undefined> = {
    search: search ? encodeURIComponent(search) : undefined,
    labCode,
  };

  // Remove undefined parameters
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  const response = await apiClient.get<Blob>('/export/supervisions', {
    params,
    responseType: 'blob',
  });
  return response.data;
};