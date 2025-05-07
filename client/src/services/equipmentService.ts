import apiClient from './apiClient';

// Define the Equipment type
interface Equipment {
  inventory_num: string;
  equip_name: string;
  equip_desc?: string | null;
  acq_date?: Date | null;
  purchase_price?: number | null;
  equip_status?: string | null;
  equip_quantity?: number | null;
  lab_code: number;
}

// Define the response type for fetching multiple equipment
interface EquipmentResponse {
  equipments: Equipment[];
  totalPages: number;
  totalItems: number;
}

// Define the response type for a single equipment
interface SingleEquipmentResponse {
  equipment: Equipment;
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
 * Fetch all equipment with pagination, sorting, search, and laboratory filtering
 */
export const fetchEquipment = async (
  page: number,
  limit: number,
  sortBy: string = 'inventory_num',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  laboratoryCode?: number | null
): Promise<EquipmentResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    sortBy,
    order,
    search: encodeURIComponent(search),
  };

  // Add laboratoryCode to the query parameters if it is provided
  if (laboratoryCode !== undefined && laboratoryCode !== null) {
    params.laboratoryCode = laboratoryCode;
  }

  const response = await apiClient.get<EquipmentResponse>('/equipment', {
    params,
  });
  return response.data;
};

export const fetchAllEquipments = async (
): Promise<EquipmentResponse> => {
  const response = await apiClient.get<EquipmentResponse>(
    `/equipment/all`
  );
  return response.data;
};

/**
 * Create a new equipment
 */
export const createEquipment = async (
  inventoryNum: string,
  equipName: string,
  labCode: number,
  equipDesc?: string,
  acqDate?: Date | string,
  purchasePrice?: number,
  equipStatus?: string,
  equipQuantity?: number
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.post<MessageResponse | ErrorResponse>('/equipment', {
    inventory_num: inventoryNum,
    equip_name: equipName,
    equip_desc: equipDesc || undefined,
    acq_date: acqDate ? new Date(acqDate).toISOString() : undefined,
    purchase_price: purchasePrice || undefined,
    equip_status: equipStatus || undefined,
    equip_quantity: equipQuantity || undefined,
    lab_code: labCode,
  });
  return response.data;
};

/**
 * Update an existing equipment
 */
export const updateEquipment = async (
  inventoryNum: string,
  equipName: string,
  labCode: number,
  equipDesc?: string,
  acqDate?: Date | string,
  purchasePrice?: number,
  equipStatus?: string,
  equipQuantity?: number
): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.put<MessageResponse | ErrorResponse>(`/equipment/${inventoryNum}`, {
    equip_name: equipName,
    equip_desc: equipDesc || undefined,
    acq_date: acqDate ? new Date(acqDate).toISOString() : undefined,
    purchase_price: purchasePrice || undefined,
    equip_status: equipStatus || undefined,
    equip_quantity: equipQuantity || undefined,
    lab_code: labCode,
  });
  return response.data;
};

/**
 * Delete an equipment by inventory number
 */
export const deleteEquipment = async (inventoryNum: string): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/equipment/${inventoryNum}`);
  return response.data;
};

/**
 * Get an equipment by inventory number
 */
export const fetchEquipmentById = async (inventoryNum: string): Promise<SingleEquipmentResponse> => {
  const response = await apiClient.get<SingleEquipmentResponse>(`/equipment/${inventoryNum}`);
  return response.data;
};

/**
 * Export equipment to Excel
 */
export const exportEquipment = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/export/equipments', {
    responseType: 'blob',
  });
  return response.data;
};