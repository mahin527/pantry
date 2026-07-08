import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";
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

export async function GET(request: NextRequest) {
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
      isActive: true,
      category: searchParams.get("category") ?? undefined,
      isFeatured: parseBool(searchParams.get("featured")),
      isPopular: parseBool(searchParams.get("popular")),
      isLatest: parseBool(searchParams.get("latest")),
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
      minRating: parseNumber(searchParams.get("rating")),
    });

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
