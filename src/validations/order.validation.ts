import { z } from "zod";
import { Types } from "mongoose";

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ID format",
});

export const createOrderSchema = z.object({
  addressId: objectId,
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
  paymentIntentId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
