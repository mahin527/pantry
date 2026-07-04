import { z } from "zod";

const allowedOrderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(allowedOrderStatuses),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
