import { NextResponse } from "next/server"
import { authorizeAdmin } from "@/lib/authorize"
import { dashboardService } from "@/services/dashboard.service"
import { error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request)
  if (!auth.authorized) return auth.response

  try {
    const result = await dashboardService.getDashboard(auth.payload.role)
    return NextResponse.json(result, { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
