import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/authorize";
import { productService } from "@/services/product.service";
import { updateProductSchema } from "@/validations/product.validation";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authorizeAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const result = await productService.findById(id);

    if (!result.success) {
      return NextResponse.json(result, { status: HTTP.NOT_FOUND });
    }

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authorizeAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await productService.update(id, parsed.data);

    if (!result.success) {
      const status = result.message === MESSAGES.PRODUCT_NOT_FOUND
        ? HTTP.NOT_FOUND
        : HTTP.CONFLICT;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authorizeAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const result = await productService.delete(id);

    if (!result.success) {
      return NextResponse.json(result, { status: HTTP.NOT_FOUND });
    }

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
