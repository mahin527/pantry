import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
  paymentIntentId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
