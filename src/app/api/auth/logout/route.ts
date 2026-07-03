import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { AUTH_COOKIE_CONFIG } from "@/constants";

export async function POST() {
  try {
    const result = await authService.logout();

    const response = NextResponse.json(result, { status: HTTP.OK });

    response.cookies.set(AUTH_COOKIE_CONFIG.name, "", {
      httpOnly: AUTH_COOKIE_CONFIG.httpOnly,
      secure: AUTH_COOKIE_CONFIG.secure,
      sameSite: AUTH_COOKIE_CONFIG.sameSite,
      path: AUTH_COOKIE_CONFIG.path,
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
