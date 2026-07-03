import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { AUTH_COOKIE_CONFIG } from "@/constants";

export async function GET() {
  try {
    const cookieStore = await import("next/headers").then((m) => m.cookies());
    const token = cookieStore.get(AUTH_COOKIE_CONFIG.name)?.value;

    if (!token) {
      return NextResponse.json(error("Not authenticated", "Unauthorized"), {
        status: 401,
      });
    }

    const result = await authService.getCurrentUser(token);

    if (!result.success) {
      const response = NextResponse.json(result, { status: 401 });
      response.cookies.set(AUTH_COOKIE_CONFIG.name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(error("Internal server error"), { status: 500 });
  }
}
