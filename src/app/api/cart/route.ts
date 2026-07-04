import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/services/cart.service";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";
import { AUTH_COOKIE_CONFIG } from "@/constants";

async function getUser(request: NextRequest): Promise<{ user: TokenPayload | null; response?: NextResponse }> {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value;
  if (!token) {
    return { user: null, response: NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED), { status: HTTP.UNAUTHORIZED }) };
  }
  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch {
    return { user: null, response: NextResponse.json(error(MESSAGES.INVALID_TOKEN), { status: HTTP.UNAUTHORIZED }) };
  }
}

export async function GET(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const result = await cartService.getCart(auth.user.userId);
    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR });
  }
}

export async function POST(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(error(MESSAGES.VALIDATION_FAILED, "productId is required"), { status: HTTP.BAD_REQUEST });
    }

    const result = await cartService.addItem(auth.user.userId, productId, quantity);
    const status = result.success ? HTTP.OK : HTTP.BAD_REQUEST;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(error(MESSAGES.VALIDATION_FAILED, "productId and quantity are required"), { status: HTTP.BAD_REQUEST });
    }

    const result = await cartService.updateQuantity(auth.user.userId, productId, quantity);
    const status = result.success ? HTTP.OK : HTTP.BAD_REQUEST;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");

    if (productId) {
      const result = await cartService.removeItem(auth.user.userId, productId);
      const status = result.success ? HTTP.OK : HTTP.NOT_FOUND;
      return NextResponse.json(result, { status });
    }

    const result = await cartService.clearCart(auth.user.userId);
    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR });
  }
}
