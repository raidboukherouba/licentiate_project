import apiClient from './apiClient';

interface TeamResponse {
  teams: any[]; // Replace 'any' with the actual team type if available
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
 * Fetch all teams with pagination, sorting, and search
 */
export const fetchTeams = async (
  page: number,
  limit: number,
  sortBy: string = 'team_id',
  order: 'asc' | 'desc' = 'asc',
  search: string = ''
): Promise<TeamResponse> => {
  const response = await apiClient.get<TeamResponse>(
    `/team?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const fetchAllTeams = async (
): Promise<TeamResponse> => {
  const response = await apiClient.get<TeamResponse>(
    `/team/all`
  );
  return response.data;
};

/**
 * Create a new team
 */
export const createTeam = async (
  teamName: string,
  teamAbbr?: string,
  teamDesc?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>(`/team`, {
    team_name: teamName,
    team_abbr: teamAbbr || undefined,
    team_desc: teamDesc || undefined,
  });
  return response.data;
};

/**
 * Update an existing team
 */
export const updateTeam = async (
  teamId: number,
  teamName: string,
  teamAbbr?: string,
  teamDesc?: string
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/team/${teamId}`, {
    team_name: teamName,
    team_abbr: teamAbbr || undefined,
    team_desc: teamDesc || undefined,
  });
  return response.data;
};

/**
 * Delete a team by ID
 */
export const deleteTeam = async (teamId: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/team/${teamId}`);
  return response.data;
};

/**
 * Export teams to Excel
 */
export const exportTeams = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/teams', {
    responseType: 'blob', // Important for handling file downloads
  });

  return response.data;
};