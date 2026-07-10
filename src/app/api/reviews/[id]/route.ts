import { NextRequest, NextResponse } from "next/server";
import { reviewService } from "@/services/review.service";
import { authenticateUser } from "@/lib/authorize";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authorized) return auth.response;

    const { id } = await params;

    const result = await reviewService.markHelpful(id);
    const status = result.success ? HTTP.OK : HTTP.NOT_FOUND;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}