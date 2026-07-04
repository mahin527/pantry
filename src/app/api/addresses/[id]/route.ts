import { NextRequest, NextResponse } from "next/server";
import { addressService } from "@/services/address.service";
import { updateAddressSchema } from "@/validations/address.validation";
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = updateAddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await addressService.update(auth.user.userId, id, parsed.data);
    const status = result.success ? HTTP.OK : HTTP.NOT_FOUND;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const { id } = await params;
    const result = await addressService.delete(auth.user.userId, id);
    const status = result.success ? HTTP.OK : HTTP.NOT_FOUND;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR });
  }
}
