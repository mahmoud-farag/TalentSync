/**
 * Common GraphQL response wrapper
 */
export interface GraphQLResponse<T> {
  data: T;
  errors?: GraphQLError[];
}

/**
 * GraphQL Error structure
 */
export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

/**
 * Standard API response wrapper (for REST)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Paginated response (GraphQL connection pattern)
 */
export interface PaginatedResponse<T> {
  edges: T[];
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
 * Sort direction
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Generic sort input
 */
export interface SortInput {
  field: string;
  direction: SortDirection;
}

/**
 * Error result from API calls
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}