import { NextRequest, NextResponse } from "next/server";
import { verifyOtpSchema } from "@/validations";
import { authService } from "@/services/auth.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await authService.verifyOtp(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: HTTP.BAD_REQUEST });
    }

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
