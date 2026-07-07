import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1, "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1, "NEXT_PUBLIC_GOOGLE_CLIENT_ID is required"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`,
    );
  }

  return parsed.data;
}

let cachedEnv: ReturnType<typeof validateEnv> | null = null;

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_, prop) {
    if (!cachedEnv) {
      cachedEnv = validateEnv();
    }
    return cachedEnv[prop as keyof typeof cachedEnv];
  },
});
