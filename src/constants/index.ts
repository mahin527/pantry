import { env } from "@/lib/env";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

export const COOKIE_NAMES = {
  SESSION: "session",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const TOKEN_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const STATUS_COLORS: Record<string, "warning" | "success" | "error" | "info" | "default"> = {
  pending: "warning",
  paid: "success",
  failed: "error",
  refunded: "info",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export type AuthCookieOptions = {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
};

export const AUTH_COOKIE_CONFIG: AuthCookieOptions = {
  name: COOKIE_NAMES.SESSION,
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};
