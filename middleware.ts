import { NextRequest, NextResponse } from "next/server"
import { AUTH_COOKIE_CONFIG } from "@/constants"
import { verifyTokenEdge } from "@/lib/auth"

const protectedRoutes = [
  "/my-account",
  "/my-orders",
  "/address",
  "/checkout",
  "/wishlist",
]

const adminRoutes = ["/admin"]

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: res.cloudinary.com",
    "font-src 'self'",
    "connect-src 'self' https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}

function setSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route))

  if (!isProtected && !isAdmin) {
    return setSecurityHeaders(NextResponse.next())
  }

  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value

  if (!token) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url),
    )
  }

  try {
    const payload = await verifyTokenEdge(token)

    // Admin routes require admin role
    if (isAdmin && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/403", request.url))
    }

    return setSecurityHeaders(NextResponse.next())
  } catch {
    const callbackUrl = encodeURIComponent(pathname)
    const redirect = NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url),
    )
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
    "/admin",
    "/admin/:path*",
  ],
}
