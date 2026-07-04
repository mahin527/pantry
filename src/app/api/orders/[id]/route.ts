import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/order.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";
import { AUTH_COOKIE_CONFIG } from "@/constants";

async function getUser(
  request: NextRequest,
): Promise<{ user: TokenPayload | null; response?: NextResponse }> {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value;
  if (!token) {
    return {
      user: null,
      response: NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED), {
        status: HTTP.UNAUTHORIZED,
      }),
    };
  }
  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch {
    return {
      user: null,
      response: NextResponse.json(error(MESSAGES.INVALID_TOKEN), {
        status: HTTP.UNAUTHORIZED,
      }),
    };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const { id } = await params;
    const result = await orderService.findMyOrderById(auth.user.userId, id);

    if (!result.success) {
      const status =
        result.message === MESSAGES.ORDER_NOT_FOUND
          ? HTTP.NOT_FOUND
          : HTTP.FORBIDDEN;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
