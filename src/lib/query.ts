import type { SortOrder } from "@/types/common";
import { PAGINATION } from "@/constants";

export function parsePage(value: unknown): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : PAGINATION.DEFAULT_PAGE;
}

export function parseLimit(value: unknown): number {
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0
    ? Math.min(limit, PAGINATION.MAX_LIMIT)
    : PAGINATION.DEFAULT_LIMIT;
}

export function parseSortOrder(value: unknown): SortOrder {
  return value === "asc" ? "asc" : "desc";
}

export function parseSearch(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function calculateSkip(page: number, limit: number): number {
  return (Math.max(1, page) - 1) * Math.max(1, limit);
}
