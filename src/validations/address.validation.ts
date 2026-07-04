import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  phone: z.string().min(1, "Phone is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  label: z.enum(["Home", "Office", "Other"]).optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100).optional(),
  phone: z.string().min(1, "Phone is required").optional(),
  country: z.string().min(1, "Country is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  area: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required").optional(),
  label: z.enum(["Home", "Office", "Other"]).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
