import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { AUTH_COOKIE_CONFIG } from "@/constants";

export async function GET() {
  try {
    const cookieStore = await import("next/headers").then((m) => m.cookies());
    const token = cookieStore.get(AUTH_COOKIE_CONFIG.name)?.value;

    if (!token) {
      return NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED, "Unauthorized"), {
        status: HTTP.UNAUTHORIZED,
      });
    }

    const result = await authService.getCurrentUser(token);

    if (!result.success) {
      const response = NextResponse.json(result, { status: HTTP.UNAUTHORIZED });
      response.cookies.set(AUTH_COOKIE_CONFIG.name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
