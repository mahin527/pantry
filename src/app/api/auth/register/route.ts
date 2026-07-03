import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validations";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { AUTH_COOKIE_CONFIG } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await authService.register(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: HTTP.CONFLICT });
    }

    const response = NextResponse.json(result, {
      status: HTTP.CREATED,
    });

    response.cookies.set(AUTH_COOKIE_CONFIG.name, result.data!.token, {
      httpOnly: AUTH_COOKIE_CONFIG.httpOnly,
      secure: AUTH_COOKIE_CONFIG.secure,
      sameSite: AUTH_COOKIE_CONFIG.sameSite,
      path: AUTH_COOKIE_CONFIG.path,
      maxAge: AUTH_COOKIE_CONFIG.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
