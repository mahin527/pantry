import { NextRequest, NextResponse } from "next/server"
import { authorizeAdmin } from "@/lib/authorize"
import { orderService } from "@/services/order.service"
import { error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { parsePage, parseLimit, parseSearch, parseSortOrder } from "@/lib/query"

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request)
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = request.nextUrl

    const page = parsePage(searchParams.get("page"))
    const limit = parseLimit(searchParams.get("limit"))
    const search = parseSearch(searchParams.get("search"))
    const status = searchParams.get("status") ?? undefined
    const paymentStatus = searchParams.get("paymentStatus") ?? undefined
    const sortField = searchParams.get("sort") || "createdAt"
    const sortOrder = parseSortOrder(searchParams.get("order"))
    const sort = { [sortField]: sortOrder === "asc" ? 1 : (-1 as 1 | -1) }

    const result = await orderService.findAll({
      page,
      limit,
      sort,
      search,
      status,
      paymentStatus,
    })

    return NextResponse.json(result, { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
