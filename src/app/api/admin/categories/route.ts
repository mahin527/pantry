import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/authorize";
import { categoryService } from "@/services/category.service";
import { createCategorySchema } from "@/validations/category.validation";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { parsePage, parseLimit, parseSearch, parseSortOrder } from "@/lib/query";

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();

    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      );
    }

    const result = await categoryService.create(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: HTTP.CONFLICT });
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

    const sortField = searchParams.get("sort") || "sortOrder";
    const sortOrder = parseSortOrder(searchParams.get("order"));
    const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 as 1 | -1 };

    const result = await categoryService.findAll({ page, limit, search, sort });

    return NextResponse.json(result, { status: HTTP.OK });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
