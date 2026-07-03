export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: Pagination;
};

export type SortOrder = "asc" | "desc";

export type BaseEntity = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AddressType = "home" | "office";
