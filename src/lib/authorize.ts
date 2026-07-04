import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { AUTH_COOKIE_CONFIG } from "@/constants";

type AuthResult =
  | { authorized: true; payload: TokenPayload }
  | { authorized: false; response: NextResponse };

export async function authorizeAdmin(request: NextRequest): Promise<AuthResult> {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value;

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED, "Unauthorized"), {
        status: HTTP.UNAUTHORIZED,
      }),
    };
  }

  let payload: TokenPayload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return {
      authorized: false,
      response: NextResponse.json(error(MESSAGES.INVALID_TOKEN, "Unauthorized"), {
        status: HTTP.UNAUTHORIZED,
      }),
    };
  }

  if (payload.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json(error(MESSAGES.FORBIDDEN, "Forbidden"), {
        status: HTTP.FORBIDDEN,
      }),
    };
  }

  return { authorized: true, payload };
}
