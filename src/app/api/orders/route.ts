import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/order.service";
import { createOrderSchema } from "@/validations/order.validation";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";
import { AUTH_COOKIE_CONFIG } from "@/constants";
import { parsePage, parseLimit, parseSortOrder } from "@/lib/query";

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

export async function POST(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const body = await request.json();

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await orderService.createOrder(
      auth.user.userId,
      parsed.data.addressId,
    );
    const status = result.success ? HTTP.CREATED : HTTP.BAD_REQUEST;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function GET(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const { searchParams } = request.nextUrl;

    const page = parsePage(searchParams.get("page"));
    const limit = parseLimit(searchParams.get("limit"));
    const status = searchParams.get("status") ?? undefined;
    const sortField = searchParams.get("sort") || "createdAt";
    const sortOrder = parseSortOrder(searchParams.get("order"));
    const sort = { [sortField]: sortOrder === "asc" ? 1 : (-1 as 1 | -1) };

    const result = await orderService.findMyOrders(auth.user.userId, {
      page,
      limit,
      sort,
      status,
    });

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
