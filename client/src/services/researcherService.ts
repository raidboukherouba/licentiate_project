import apiClient from './apiClient';

// Define the Researcher type
interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
  res_fname_ar: string;
  res_lname_ar: string;
  res_gender: 'Male' | 'Female';
  res_attach_struc?: string | null;
  res_birth_date?: string | null;
  res_phone?: string | null;
  res_address?: string | null;
  res_grade?: string | null;
  res_diploma?: string | null;
  res_prof_email: string;
  res_pers_email?: string | null;
  res_gs_link?: string | null;
  res_rg_link?: string | null;
  res_page_link?: string | null;
  res_orcid?: string | null;
  res_pub_count: number;
  res_cit_count: number;
  func_code: number;
  spec_code: number;
  team_id: number;
  lab_code: number;
  is_director: true | false;
}

// Define the response type for fetching multiple researchers
interface ResearcherResponse {
  researchers: Researcher[];
  totalPages: number;
  totalItems: number;
}

// Define the response type for a single researcher
interface SingleResearcherResponse {
  researcher: Researcher;
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
 * Fetch all researchers with pagination, sorting, search, and filtering
 */
export const fetchResearchers = async (
  page: number,
  limit: number,
  sortBy: string = 'res_code',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  teamId?: number | null,
  laboratoryId?: number | null
): Promise<ResearcherResponse> => {
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

  const response = await apiClient.get<ResearcherResponse>('/researcher', {
    params,
  });
  return response.data;
};

export const fetchAllResearchers = async (): Promise<ResearcherResponse> => {
  const response = await apiClient.get<ResearcherResponse>('/researcher/all');
  return response.data;
};

/**
 * Create a new researcher
 */
export const createResearcher = async (
  resFname: string,
  resLname: string,
  resFnameAr: string,
  resLnameAr: string,
  resGender: 'Male' | 'Female',
  resProfEmail: string,
  funcCode: number,
  specCode: number,
  teamId: number,
  laboratoryId: number,
  isDirector: true | false,
  resAttachStruc?: string,
  resBirthDate?: string,
  resPhone?: string,
  resAddress?: string,
  resGrade?: string,
  resDiploma?: string,
  resPersEmail?: string,
  resGsLink?: string,
  resRgLink?: string,
  resPageLink?: string,
  resOrcid?: string,
  resPubCount?: number,
  resCitCount?: number,
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/researcher', {
    res_fname: resFname,
    res_lname: resLname,
    res_fname_ar: resFnameAr,
    res_lname_ar: resLnameAr,
    res_gender: resGender,
    res_prof_email: resProfEmail,
    func_code: funcCode,
    spec_code: specCode,
    team_id: teamId,
    res_attach_struc: resAttachStruc || undefined,
    res_birth_date: resBirthDate || undefined,
    res_phone: resPhone || undefined,
    res_address: resAddress || undefined,
    res_grade: resGrade || undefined,
    res_diploma: resDiploma || undefined,
    res_pers_email: resPersEmail || undefined,
    res_gs_link: resGsLink || undefined,
    res_rg_link: resRgLink || undefined,
    res_page_link: resPageLink || undefined,
    res_orcid: resOrcid || undefined,
    res_pub_count: resPubCount || 0,
    res_cit_count: resCitCount || 0,
    lab_code: laboratoryId,
    is_director: isDirector,
  });
  return response.data;
};

/**
 * Update an existing researcher
 */
export const updateResearcher = async (
  resCode: number,
  resFname: string,
  resLname: string,
  resFnameAr: string,
  resLnameAr: string,
  resGender: 'Male' | 'Female',
  resProfEmail: string,
  funcCode: number,
  specCode: number,
  teamId: number,
  laboratoryId: number,
  isDirector: true | false,
  resAttachStruc?: string,
  resBirthDate?: string,
  resPhone?: string,
  resAddress?: string,
  resGrade?: string,
  resDiploma?: string,
  resPersEmail?: string,
  resGsLink?: string,
  resRgLink?: string,
  resPageLink?: string,
  resOrcid?: string,
  resPubCount?: number,
  resCitCount?: number,
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/researcher/${resCode}`, {
    res_fname: resFname,
    res_lname: resLname,
    res_fname_ar: resFnameAr,
    res_lname_ar: resLnameAr,
    res_gender: resGender,
    res_prof_email: resProfEmail,
    func_code: funcCode,
    spec_code: specCode,
    team_id: teamId,
    res_attach_struc: resAttachStruc || undefined,
    res_birth_date: resBirthDate || undefined,
    res_phone: resPhone || undefined,
    res_address: resAddress || undefined,
    res_grade: resGrade || undefined,
    res_diploma: resDiploma || undefined,
    res_pers_email: resPersEmail || undefined,
    res_gs_link: resGsLink || undefined,
    res_rg_link: resRgLink || undefined,
    res_page_link: resPageLink || undefined,
    res_orcid: resOrcid || undefined,
    res_pub_count: resPubCount || 0,
    res_cit_count: resCitCount || 0,
    lab_code: laboratoryId,
    is_director: isDirector,
  });
  return response.data;
};

/**
 * Delete a researcher by ID
 */
export const deleteResearcher = async (resCode: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/researcher/${resCode}`);
  return response.data;
};

/**
 * Get a researcher by ID
 */
export const fetchResearcherById = async (resCode: number): Promise<SingleResearcherResponse> => {
  const response = await apiClient.get<SingleResearcherResponse>(`/researcher/${resCode}`);
  return response.data;
};

/**
 * Export researchers to Excel
 */
export const exportResearchers = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/researchers', {
    responseType: 'blob', // Important for handling file downloads
  });
  return response.data;
};