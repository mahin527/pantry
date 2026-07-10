import { NextRequest, NextResponse } from "next/server"
import { cartService } from "@/services/cart.service"
import { addToCartSchema, updateCartSchema } from "@/validations/cart.validation"
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
    const result = await cartService.getCart(auth.user.userId)
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

    const parsed = addToCartSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      )
    }

    const result = await cartService.addItem(
      auth.user.userId,
      parsed.data.productId,
      parsed.data.quantity,
    )
    const status = result.success ? HTTP.OK : HTTP.BAD_REQUEST
    return NextResponse.json(result, { status })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.user) return auth.response!

  try {
    const body = await request.json()

    const parsed = updateCartSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, parsed.error.issues[0]?.message),
        { status: HTTP.BAD_REQUEST },
      )
    }

    const result = await cartService.updateQuantity(
      auth.user.userId,
      parsed.data.productId,
      parsed.data.quantity,
    )
    const status = result.success ? HTTP.OK : HTTP.BAD_REQUEST
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
    const body = await request.json().catch(() => ({}))
    const productId = body?.productId || request.nextUrl.searchParams.get("productId")

    if (productId) {
      const result = await cartService.removeItem(auth.user.userId, productId)
      const status = result.success ? HTTP.OK : HTTP.NOT_FOUND
      return NextResponse.json(result, { status })
    }

    const result = await cartService.clearCart(auth.user.userId)
    return NextResponse.json(result, { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
