import apiClient from './apiClient';

// Define the DoctoralStudent type
interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
  doc_stud_fname_ar: string;
  doc_stud_lname_ar: string;
  doc_stud_gender: 'Male' | 'Female';
  doc_stud_attach_struc?: string | null;
  doc_stud_birth_date?: string | null;
  doc_stud_phone?: string | null;
  doc_stud_address?: string | null;
  doc_stud_grade?: string | null;
  doc_stud_diploma?: string | null;
  doc_stud_prof_email: string;
  doc_stud_pers_email?: string | null;
  doc_stud_gs_link?: string | null;
  doc_stud_rg_link?: string | null;
  doc_stud_page_link?: string | null;
  doc_stud_orcid?: string | null;
  doc_stud_pub_count: number;
  doc_stud_cit_count: number;
  func_code: number;
  spec_code: number;
  team_id: number;
  lab_code: number;
}

// Define the response type for fetching multiple doctoral students
interface DoctoralStudentResponse {
  doctoralStudents: DoctoralStudent[];
  totalPages: number;
  totalItems: number;
}

// Define the response type for a single doctoral student
interface SingleDoctoralStudentResponse {
  doctoralStudent: DoctoralStudent;
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
 * Fetch all doctoral students with pagination, sorting, search, and filtering
 */
export const fetchDoctoralStudents = async (
  page: number,
  limit: number,
  sortBy: string = 'reg_num',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  teamId?: number | null,
  laboratoryId?: number | null
): Promise<DoctoralStudentResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    sortBy,
    order,
    search: encodeURIComponent(search),
  };

  // Add teamId to the query parameters if it is provided
  if (teamId !== undefined && teamId !== null) {
    params.teamId = teamId;
  }

  // Add laboratoryId to the query parameters if it is provided
  if (laboratoryId !== undefined && laboratoryId !== null) {
    params.laboratoryId = laboratoryId;
  }

  const response = await apiClient.get<DoctoralStudentResponse>('/doctoral-student', {
    params,
  });
  return response.data;
};

export const fetchAllDoctoralStudents = async (): Promise<DoctoralStudentResponse> => {
  const response = await apiClient.get<DoctoralStudentResponse>('/doctoral-student/all');
  return response.data;
};

/**
 * Create a new doctoral student
 */
export const createDoctoralStudent = async (
  regNum: number,
  docStudFname: string,
  docStudLname: string,
  docStudFnameAr: string,
  docStudLnameAr: string,
  docStudGender: 'Male' | 'Female',
  docStudProfEmail: string,
  funcCode: number,
  specCode: number,
  teamId: number,
  laboratoryId: number,
  docStudAttachStruc?: string,
  docStudBirthDate?: string,
  docStudPhone?: string,
  docStudAddress?: string,
  docStudGrade?: string,
  docStudDiploma?: string,
  docStudPersEmail?: string,
  docStudGsLink?: string,
  docStudRgLink?: string,
  docStudPageLink?: string,
  docStudOrcid?: string,
  docStudPubCount?: number,
  docStudCitCount?: number,
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/doctoral-student', {
    reg_num: regNum,
    doc_stud_fname: docStudFname,
    doc_stud_lname: docStudLname,
    doc_stud_fname_ar: docStudFnameAr,
    doc_stud_lname_ar: docStudLnameAr,
    doc_stud_gender: docStudGender,
    doc_stud_prof_email: docStudProfEmail,
    func_code: funcCode,
    spec_code: specCode,
    team_id: teamId,
    lab_code: laboratoryId,
    doc_stud_attach_struc: docStudAttachStruc || undefined,
    doc_stud_birth_date: docStudBirthDate || undefined,
    doc_stud_phone: docStudPhone || undefined,
    doc_stud_address: docStudAddress || undefined,
    doc_stud_grade: docStudGrade || undefined,
    doc_stud_diploma: docStudDiploma || undefined,
    doc_stud_pers_email: docStudPersEmail || undefined,
    doc_stud_gs_link: docStudGsLink || undefined,
    doc_stud_rg_link: docStudRgLink || undefined,
    doc_stud_page_link: docStudPageLink || undefined,
    doc_stud_orcid: docStudOrcid || undefined,
    doc_stud_pub_count: docStudPubCount || 0,
    doc_stud_cit_count: docStudCitCount || 0,
  });
  return response.data;
};

/**
 * Update an existing doctoral student
 */
export const updateDoctoralStudent = async (
  regNum: number,
  docStudFname: string,
  docStudLname: string,
  docStudFnameAr: string,
  docStudLnameAr: string,
  docStudGender: 'Male' | 'Female',
  docStudProfEmail: string,
  funcCode: number,
  specCode: number,
  teamId: number,
  laboratoryId: number,
  docStudAttachStruc?: string,
  docStudBirthDate?: string,
  docStudPhone?: string,
  docStudAddress?: string,
  docStudGrade?: string,
  docStudDiploma?: string,
  docStudPersEmail?: string,
  docStudGsLink?: string,
  docStudRgLink?: string,
  docStudPageLink?: string,
  docStudOrcid?: string,
  docStudPubCount?: number,
  docStudCitCount?: number,
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/doctoral-student/${regNum}`, {
    reg_num: regNum,
    doc_stud_fname: docStudFname,
    doc_stud_lname: docStudLname,
    doc_stud_fname_ar: docStudFnameAr,
    doc_stud_lname_ar: docStudLnameAr,
    doc_stud_gender: docStudGender,
    doc_stud_prof_email: docStudProfEmail,
    func_code: funcCode,
    spec_code: specCode,
    team_id: teamId,
    lab_code: laboratoryId,
    doc_stud_attach_struc: docStudAttachStruc || undefined,
    doc_stud_birth_date: docStudBirthDate || undefined,
    doc_stud_phone: docStudPhone || undefined,
    doc_stud_address: docStudAddress || undefined,
    doc_stud_grade: docStudGrade || undefined,
    doc_stud_diploma: docStudDiploma || undefined,
    doc_stud_pers_email: docStudPersEmail || undefined,
    doc_stud_gs_link: docStudGsLink || undefined,
    doc_stud_rg_link: docStudRgLink || undefined,
    doc_stud_page_link: docStudPageLink || undefined,
    doc_stud_orcid: docStudOrcid || undefined,
    doc_stud_pub_count: docStudPubCount || 0,
    doc_stud_cit_count: docStudCitCount || 0,
  });
  return response.data;
};

/**
 * Delete a doctoral student by registration number
 */
export const deleteDoctoralStudent = async (regNum: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/doctoral-student/${regNum}`);
  return response.data;
};

/**
 * Get a doctoral student by registration number
 */
export const fetchDoctoralStudentById = async (regNum: number): Promise<SingleDoctoralStudentResponse> => {
  const response = await apiClient.get<SingleDoctoralStudentResponse>(`/doctoral-student/${regNum}`);
  return response.data;
};

/**
 * Export doctoral students to Excel
 */
export const exportDoctoralStudents = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/doctoral-students', {
    responseType: 'blob', // Important for handling file downloads
  });
  return response.data;
};