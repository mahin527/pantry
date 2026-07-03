import type { ApiResponse } from "@/types/common";

export function success<T>(data: T, message = "Success"): ApiResponse<T> {
  return { success: true, message, data };
}

export function error(message: string, err?: string): ApiResponse<never> {
  return { success: false, message, error: err ?? message };
}

export function message(message: string, success = true): ApiResponse<never> {
  return { success, message };
}
