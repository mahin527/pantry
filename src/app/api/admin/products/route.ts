import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/authorize";
import { productService } from "@/services/product.service";
import { createProductSchema } from "@/validations/product.validation";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { parsePage, parseLimit, parseSearch, parseSortOrder } from "@/lib/query";

function parseBool(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();

    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await productService.create(parsed.data);

    if (!result.success) {
      const status = result.message === MESSAGES.CATEGORY_INVALID
        ? HTTP.BAD_REQUEST
        : HTTP.CONFLICT;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: HTTP.CREATED });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = request.nextUrl;

    const page = parsePage(searchParams.get("page"));
    const limit = parseLimit(searchParams.get("limit"));
    const search = parseSearch(searchParams.get("search"));

    const sortField = searchParams.get("sort") || "createdAt";
    const sortOrder = parseSortOrder(searchParams.get("order"));
    const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 as 1 | -1 };

    const result = await productService.findAll({
      page,
      limit,
      search,
      sort,
      category: searchParams.get("category") ?? undefined,
      isFeatured: parseBool(searchParams.get("featured")),
      isPopular: parseBool(searchParams.get("popular")),
      isLatest: parseBool(searchParams.get("latest")),
      isActive: parseBool(searchParams.get("active")),
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
    });

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
