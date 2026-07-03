import type { Pagination } from "@/types/common";
import { PAGINATION } from "@/constants";

type PaginationInput = {
  page?: number;
  limit?: number;
  total: number;
};

export function calculatePagination(input: PaginationInput): Pagination {
  const page = Math.max(1, input.page ?? PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, input.limit ?? PAGINATION.DEFAULT_LIMIT),
  );

  return {
    page,
    limit,
    total: input.total,
    totalPages: Math.ceil(input.total / limit),
  };
}
