import apiClient from './apiClient';

// Category type
interface Category {
  cat_id: number;
  cat_name: string;
}

// ReviewSpeciality type
interface ReviewSpeciality {
  spec_id_review: number;
  spec_name_review: string;
}
// Core Review type (without associations)
interface Review {
  review_num: number;
  review_title: string;
  issn: string;
  e_issn: string | null;
  review_vol: string | null;
  publisher_id: number;
  Categories?: Category[];
  ReviewSpecialities?: ReviewSpeciality[];
}

// Review with publisher association
interface ReviewWithAssociation extends Review {
  publisher?: {
    publisher_id: number;
    publisher_name: string;
  };
}

// Response types
interface ReviewsResponse {
  reviews: ReviewWithAssociation[];
  totalPages: number;
  totalItems: number;
}

interface SingleReviewResponse {
  review: ReviewWithAssociation;
}

interface MessageResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Fetch all reviews with pagination, sorting, and search
 * @param includePublisher - Whether to include publisher data (default: true)
 */
export const fetchReviews = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'review_num',
  order: 'asc' | 'desc' = 'asc',
  search: string = '',
  includePublisher: boolean = true
): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ReviewsResponse>(
    `/review?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}&includePublisher=${includePublisher}`
  );
  return response.data;
};

export const fetchAllReviews = async (
): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ReviewsResponse>(
    `/review/all`
  );
  return response.data;
};

/**
 * Create a new review
 */
export const createReview = async (
  reviewData: {
    review_title: string;
    issn: string;
    publisher_id: number;
    e_issn?: string;
    review_vol?: string;
  }
): Promise<SingleReviewResponse | ErrorResponse> => {
  const response = await apiClient.post<SingleReviewResponse | ErrorResponse>('/review', {
    ...reviewData,
    e_issn: reviewData.e_issn || undefined,
    review_vol: reviewData.review_vol || undefined
  });
  return response.data;
};

/**
 * Update an existing review
 */
export const updateReview = async (
  reviewNum: number,
  reviewData: {
    review_title?: string;
    issn?: string;
    publisher_id?: number;
    e_issn?: string | null;
    review_vol?: string | null;
  }
): Promise<SingleReviewResponse | ErrorResponse> => {
  const response = await apiClient.put<SingleReviewResponse | ErrorResponse>(
    `/review/${reviewNum}`,
    reviewData
  );
  return response.data;
};

/**
 * Delete a review by ID
 */
export const deleteReview = async (reviewNum: number): Promise<MessageResponse | ErrorResponse> => {
  const response = await apiClient.delete<MessageResponse | ErrorResponse>(`/review/${reviewNum}`);
  return response.data;
};

/**
 * Get a review by ID
 * @param includePublisher - Whether to include publisher data (default: true)
 */
export const fetchReviewById = async (
  reviewNum: number,
  includePublisher: boolean = true
): Promise<SingleReviewResponse> => {
  const response = await apiClient.get<SingleReviewResponse>(
    `/review/${reviewNum}?includePublisher=${includePublisher}`
  );
  return response.data;
};