import { z } from "zod";
import { Types } from "mongoose";

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ID format",
});

export const addToWishlistSchema = z.object({
  productId: objectId,
});

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
