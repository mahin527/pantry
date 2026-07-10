import { z } from "zod";
import { Types } from "mongoose";

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ID format",
});

export const addToCartSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1).default(1),
});

export const updateCartSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
