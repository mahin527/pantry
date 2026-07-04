import { NextRequest, NextResponse } from "next/server"
import { wishlistService } from "@/services/wishlist.service"
import { addToWishlistSchema } from "@/validations/wishlist.validation"
import { error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { verifyAccessToken, type TokenPayload } from "@/lib/auth"
import { AUTH_COOKIE_CONFIG } from "@/constants"

async function getUser(
  request: NextRequest,
): Promise<{ user: TokenPayload | null; response?: NextResponse }> {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value
  if (!token) {
    return {
      user: null,
      response: NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED), {
        status: HTTP.UNAUTHORIZED,
      }),
    }
  }
  try {
    const user = verifyAccessToken(token)
    return { user }
  } catch {
    return {
      user: null,
      response: NextResponse.json(error(MESSAGES.INVALID_TOKEN), {
        status: HTTP.UNAUTHORIZED,
      }),
    }
  }
}

export async function GET(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.user) return auth.response!

  try {
    const result = await wishlistService.getWishlist(auth.user.userId)
    return NextResponse.json(result, { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}

export async function POST(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.user) return auth.response!

  try {
    const body = await request.json()

    const parsed = addToWishlistSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      )
    }

    const result = await wishlistService.addItem(
      auth.user.userId,
      parsed.data.productId,
    )
    const status = result.success ? HTTP.OK : HTTP.CONFLICT
    return NextResponse.json(result, { status })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.user) return auth.response!

  try {
    const { searchParams } = request.nextUrl
    const productId = searchParams.get("productId")

    if (productId) {
      const result = await wishlistService.removeItem(auth.user.userId, productId)
      return NextResponse.json(result, { status: HTTP.OK })
    }

    const result = await wishlistService.clearWishlist(auth.user.userId)
    return NextResponse.json(result, { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
