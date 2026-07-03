import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validations";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { AUTH_COOKIE_CONFIG } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error("Validation failed", parsed.error.issues[0]?.message),
        { status: 400 },
      );
    }

    const result = await authService.login(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    const response = NextResponse.json(result, { status: 200 });

    response.cookies.set(AUTH_COOKIE_CONFIG.name, result.data!.token, {
      httpOnly: AUTH_COOKIE_CONFIG.httpOnly,
      secure: AUTH_COOKIE_CONFIG.secure,
      sameSite: AUTH_COOKIE_CONFIG.sameSite,
      path: AUTH_COOKIE_CONFIG.path,
      maxAge: AUTH_COOKIE_CONFIG.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(error("Internal server error"), { status: 500 });
  }
}
