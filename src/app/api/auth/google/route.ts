import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { User } from "@/models"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/auth"
import { success, error } from "@/lib/api-response"
import { HTTP } from "@/lib/http-status"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("[Google Auth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
      return NextResponse.json(
        error("Server configuration error"),
        { status: HTTP.INTERNAL_SERVER_ERROR },
      )
    }

    const body = await request.json()
    const { credential } = body

    console.log("[Google Auth] Request received")
    console.log("[Google Auth] Credential exists:", Boolean(credential))

    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        error("Missing Google credential"),
        { status: HTTP.BAD_REQUEST },
      )
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    let userInfo: { email?: string; name?: string; picture?: string }

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()
      userInfo = {
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
      }
    } catch {
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`,
      )
      if (!googleRes.ok) {
        const errorText = await googleRes.text()
        return NextResponse.json(
          error(`Google API returned ${googleRes.status}: ${errorText.substring(0, 200)}`),
          { status: HTTP.UNAUTHORIZED },
        )
      }
      userInfo = await googleRes.json()
    }

    if (!userInfo.email) {
      return NextResponse.json(
        error("Google account has no email"),
        { status: HTTP.UNAUTHORIZED },
      )
    }

    console.log("[Google Auth] Authenticated email:", userInfo.email)

    await connectDB()

    let user = await User.findOne({ email: userInfo.email })

    if (!user) {
      user = await User.create({
        name: userInfo.name || userInfo.email.split("@")[0],
        email: userInfo.email,
        avatar: userInfo.picture || undefined,
        authProvider: "google",
        role: "user",
        isVerified: true,
        emailVerifiedAt: new Date(),
      })
    }

    const token = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json(
      success(
        {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        },
        "Google sign-in successful",
      ),
      { status: HTTP.OK },
    )

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (err) {
    console.error("[Google Auth] Error:", err)
    return NextResponse.json(
      error("Google authentication failed: " + (err instanceof Error ? err.message : String(err))),
      { status: HTTP.INTERNAL_SERVER_ERROR },
    )
  }
}
