import { NextRequest, NextResponse } from "next/server"
import { AUTH_COOKIE_CONFIG } from "@/constants"
import { verifyTokenEdge } from "@/lib/auth"

const protectedRoutes = [
  "/my-account",
  "/my-orders",
  "/address",
  "/checkout",
  "/wishlist",
  "/admin",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (!isProtected) {
    const response = NextResponse.next()
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    )
    return response
  }

  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await verifyTokenEdge(token)
    const response = NextResponse.next()
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    )
    return response
  } catch {
    const redirect = NextResponse.redirect(new URL("/login", request.url))
    redirect.cookies.set(AUTH_COOKIE_CONFIG.name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
    return redirect
  }
}

export const config = {
  matcher: [
    "/my-account/:path*",
    "/my-orders/:path*",
    "/address/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
  ],
}
