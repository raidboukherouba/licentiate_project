import apiClient from './apiClient';

// Define the AssignResearcher type with expanded information from associations
interface AssignResearcher {
  res_code: number;
  inventory_num: string;
  res_assign_date: string;
  res_return_date?: string | null;
  Researcher?: {
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
    lab_code: number;
    laboratory?: {
      lab_name: string;
    };
  };
  Equipment?: {
    equip_name: string;
    inventory_num: string;
  };
}

// Define the response type for fetching multiple assignments
interface AssignResearcherResponse {
  assignments: AssignResearcher[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Define the response type for a single assignment
interface SingleAssignResearcherResponse {
  assignment: AssignResearcher;
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
 * Fetch all assignments with pagination, sorting, search, and laboratory filtering
 */
export const fetchAssignResearchers = async (
  page: number,
  limit: number,
  sortBy: string = 'res_code',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  labCode?: number | null
): Promise<AssignResearcherResponse> => {
  const params: Record<string, string | number | null | undefined> = {
    page,
    limit,
    sortBy,
    order,
    search: encodeURIComponent(search),
    labCode: labCode !== undefined ? labCode : undefined,
  };

  // Remove undefined parameters
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  const response = await apiClient.get<AssignResearcherResponse>('/assign-researcher', {
    params,
  });
  return response.data;
};

/**
 * Create a new assignment record
 */
export const createAssignResearcher = async (
  resCode: number,
  inventoryNum: string,
  resAssignDate: Date | string,
  resReturnDate?: Date | string | null
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/assign-researcher', {
    res_code: resCode,
    inventory_num: inventoryNum,
    res_assign_date: typeof resAssignDate === 'string' ? resAssignDate : resAssignDate.toISOString(),
    res_return_date: resReturnDate 
      ? (typeof resReturnDate === 'string' ? resReturnDate : resReturnDate.toISOString())
      : null,
  });
  return response.data;
};

/**
 * Update an existing assignment record
 */
export const updateAssignResearcher = async (
  resCode: number,
  inventoryNum: string,
  resAssignDate: Date | string,
  resReturnDate?: Date | string | null
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(
    `/assign-researcher/${resCode}/${inventoryNum}`,
    {
      res_assign_date: typeof resAssignDate === 'string' ? resAssignDate : resAssignDate.toISOString(),
      res_return_date: resReturnDate 
        ? (typeof resReturnDate === 'string' ? resReturnDate : resReturnDate.toISOString())
        : null,
    }
  );
  return response.data;
};

/**
 * Delete an assignment record by composite key (res_code and inventory_num)
 */
export const deleteAssignResearcher = async (
  resCode: number,
  inventoryNum: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(
    `/assign-researcher/${resCode}/${inventoryNum}`
  );
  return response.data;
};

/**
 * Get an assignment record by composite key (res_code and inventory_num)
 */
export const fetchAssignResearcherById = async (
  resCode: number,
  inventoryNum: string
): Promise<SingleAssignResearcherResponse> => {
  const response = await apiClient.get<SingleAssignResearcherResponse>(
    `/assign-researcher/${resCode}/${inventoryNum}`
  );
  return response.data;
};

/**
 * Export assignments to Excel with optional filters
 */
export const exportAssignResearchers = async (
  search?: string,
  labCode?: number
): Promise<Blob> => {
  const params: Record<string, string | number | undefined> = {
    search: search ? encodeURIComponent(search) : undefined,
    labCode,
  };

  // Remove undefined parameters
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  const response = await apiClient.get<Blob>('/export/researchers-assignments', {
    params,
    responseType: 'blob',
  });
  return response.data;
};