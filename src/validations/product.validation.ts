import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  discountPrice: z.number().min(0, "Discount price must be 0 or greater").optional(),
  stock: z.number().int().min(0, "Stock must be 0 or greater").default(0),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isLatest: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required").optional(),
  images: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be 0 or greater").optional(),
  discountPrice: z.number().min(0, "Discount price must be 0 or greater").optional(),
  stock: z.number().int().min(0, "Stock must be 0 or greater").optional(),
  sku: z.string().min(1, "SKU is required").optional(),
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isLatest: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
