/**
 * Common API response types
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Paginated list response (relay-style)
 */
export interface PaginatedResponse<T> {
  edges: {
    node: T;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

/**
 * Pagination input arguments
 */
export interface PaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

/**
 * Sort input
 */
export interface SortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Filter input (generic)
 */
export interface FilterInput {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: string | number | boolean | string[];
}