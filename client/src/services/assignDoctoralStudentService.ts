import apiClient from './apiClient';

// Define the AssignDoctoralStudent type with expanded information from associations
interface AssignDoctoralStudent {
  reg_num: number;
  inventory_num: string;
  doc_stud_assign_date: string;
  doc_stud_return_date?: string | null;
  DoctoralStudent?: {
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_email: string;
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
interface AssignDoctoralStudentResponse {
  assignments: AssignDoctoralStudent[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Define the response type for a single assignment
interface SingleAssignDoctoralStudentResponse {
  assignment: AssignDoctoralStudent;
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
export const fetchAssignDoctoralStudents = async (
  page: number,
  limit: number,
  sortBy: string = 'reg_num',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  labCode?: number | null
): Promise<AssignDoctoralStudentResponse> => {
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

  const response = await apiClient.get<AssignDoctoralStudentResponse>('/assign-doctoral-student', {
    params,
  });
  return response.data;
};

/**
 * Create a new assignment record
 */
export const createAssignDoctoralStudent = async (
  regNum: number,
  inventoryNum: string,
  docStudAssignDate: Date | string,
  docStudReturnDate?: Date | string | null
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/assign-doctoral-student', {
    reg_num: regNum,
    inventory_num: inventoryNum,
    doc_stud_assign_date: typeof docStudAssignDate === 'string' ? docStudAssignDate : docStudAssignDate.toISOString(),
    doc_stud_return_date: docStudReturnDate 
      ? (typeof docStudReturnDate === 'string' ? docStudReturnDate : docStudReturnDate.toISOString())
      : null,
  });
  return response.data;
};

/**
 * Update an existing assignment record
 */
export const updateAssignDoctoralStudent = async (
  regNum: number,
  inventoryNum: string,
  docStudAssignDate: Date | string,
  docStudReturnDate?: Date | string | null
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(
    `/assign-doctoral-student/${regNum}/${inventoryNum}`,
    {
      doc_stud_assign_date: typeof docStudAssignDate === 'string' ? docStudAssignDate : docStudAssignDate.toISOString(),
      doc_stud_return_date: docStudReturnDate 
        ? (typeof docStudReturnDate === 'string' ? docStudReturnDate : docStudReturnDate.toISOString())
        : null,
    }
  );
  return response.data;
};

/**
 * Delete an assignment record by composite key (reg_num and inventory_num)
 */
export const deleteAssignDoctoralStudent = async (
  regNum: number,
  inventoryNum: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(
    `/assign-doctoral-student/${regNum}/${inventoryNum}`
  );
  return response.data;
};

/**
 * Get an assignment record by composite key (reg_num and inventory_num)
 */
export const fetchAssignDoctoralStudentById = async (
  regNum: number,
  inventoryNum: string
): Promise<SingleAssignDoctoralStudentResponse> => {
  const response = await apiClient.get<SingleAssignDoctoralStudentResponse>(
    `/assign-doctoral-student/${regNum}/${inventoryNum}`
  );
  return response.data;
};

/**
 * Export assignments to Excel with optional filters
 */
export const exportAssignDoctoralStudents = async (
  search?: string,
  labCode?: number
): Promise<Blob> => {
  const params: Record<string, string | number | undefined> = {
    search: search ? encodeURIComponent(search) : undefined,
    labCode,
  };

  // Remove undefined parameters
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  const response = await apiClient.get<Blob>('/export/doctoral-students-assignments', {
    params,
    responseType: 'blob',
  });
  return response.data;
};