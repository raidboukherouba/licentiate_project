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

// Review type
interface Review {
  review_num: number;
  review_title: string;
}

// Core Publication type (without associations)
interface Publication {
  doi: string;
  article_title: string;
  submission_date: string; // ISO date string
  acceptance_date: string; // ISO date string
  pub_pages: string | null;
  review_num: number;
  type_id: number;
  Researchers?: Researcher[];
  DoctoralStudents?: DoctoralStudent[];
}

// Publication with associations
interface PublicationWithAssociations extends Publication {
  review?: Review;
  production_type?: ProductionType;
}

// Response types
interface PublicationsResponse {
  publications: PublicationWithAssociations[];
  totalPages: number;
  totalItems: number;
}

interface SinglePublicationResponse {
  publication: PublicationWithAssociations;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Fetch all publications with pagination, sorting, and search
 * @param includeAssociations - Whether to include associated data (default: true)
 */
export const fetchPublications = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'submission_date',
  order: 'asc' | 'desc' = 'desc',
  search: string = '',
  laboratoryCode?: number | null,
  includeAssociations: boolean = true
): Promise<PublicationsResponse> => {
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

  const response = await apiClient.get<PublicationsResponse>('/publication', {
    params,
  });
  return response.data;
};

/**
 * Create a new publication
 */
export const createPublication = async (
  publicationData: {
    doi: string;
    article_title: string;
    submission_date: string;
    acceptance_date: string;
    pub_pages?: string | null;
    review_num: number;
    type_id: number;
  }
): Promise<SinglePublicationResponse | ErrorResponse> => {
  const response = await apiClient.post<SinglePublicationResponse | ErrorResponse>('/publication', {
    ...publicationData,
    pub_pages: publicationData.pub_pages || undefined
  });
  return response.data;
};

/**
 * Update an existing publication
 */
export const updatePublication = async (
  doi: string,
  publicationData: {
    article_title?: string;
    submission_date?: string;
    acceptance_date?: string;
    pub_pages?: string | null;
    review_num?: number;
    type_id?: number;
  }
): Promise<SinglePublicationResponse | ErrorResponse> => {
  const encodedDoi = encodeURIComponent(doi); // Encode DOI
  const response = await apiClient.put<SinglePublicationResponse | ErrorResponse>(
    `/publication/${encodedDoi}`,
    publicationData
  );
  return response.data;
};

/**
 * Delete a publication by DOI
 */
export const deletePublication = async (doi: string): Promise<MessageResponse | ErrorResponse> => {
  const encodedDoi = encodeURIComponent(doi); // Encode DOI
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/publication/${encodedDoi}`);
  return response.data;
};

/**
 * Get a publication by DOI
 * @param includeAssociations - Whether to include associated data (default: true)
 */
export const fetchPublicationById = async (
  doi: string,
  includeAssociations: boolean = true
): Promise<SinglePublicationResponse> => {
  const encodedDoi = encodeURIComponent(doi); // Encode DOI
  const response = await apiClient.get<SinglePublicationResponse>(
    `/publication/${encodedDoi}?includeAssociations=${includeAssociations}`
  );
  return response.data;
};

/**
 * Export publications to Excel
 */
export const exportPublications = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/publications', {
    responseType: 'blob', // Important for handling file downloads
  });

  return response.data;
};