import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_CONFIG } from "@/constants";

const protectedRoutes = [
  "/my-account",
  "/my-orders",
  "/address",
  "/checkout",
  "/wishlist",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token structure");
    }
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error("Token expired");
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set(AUTH_COOKIE_CONFIG.name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}

export const config = {
  matcher: [
    "/my-account/:path*",
    "/my-orders/:path*",
    "/address/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
  ],
};
