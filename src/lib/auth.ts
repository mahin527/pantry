import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "./env";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export type TokenPayload = {
  userId: string;
  email: string;
  role: "user" | "admin";
};

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

function base64urlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function verifyTokenEdge(token: string): Promise<TokenPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  const header = JSON.parse(
    new TextDecoder().decode(base64urlToUint8Array(headerB64)),
  );
  if (header.alg !== "HS256") {
    throw new Error("Unexpected algorithm");
  }

  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signature = base64urlToUint8Array(signatureB64);
  const data = new TextEncoder().encode(signingInput);

  const isValid = await crypto.subtle.verify("HMAC", key, signature as BufferSource, data);
  if (!isValid) {
    throw new Error("Invalid signature");
  }

  const payload = JSON.parse(
    new TextDecoder().decode(base64urlToUint8Array(payloadB64)),
  );

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    throw new Error("Token expired");
  }

  return payload as TokenPayload;
}
