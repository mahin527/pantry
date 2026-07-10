import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validations";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success, resetTime } = rateLimit(`register:${ip}`);
    if (!success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, "Too many registration attempts. Please try again later."),
        {
          status: HTTP.TOO_MANY_REQUESTS,
          headers: { "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)) },
        },
      );
    }

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

    return response;
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
