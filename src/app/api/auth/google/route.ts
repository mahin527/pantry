import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { User } from "@/models"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/auth"
import { success, error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { AUTH_COOKIE_CONFIG } from "@/constants"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      logger.error("[Google Auth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
      return NextResponse.json(
        error("Server configuration error"),
        { status: HTTP.INTERNAL_SERVER_ERROR },
      )
    }

    // Read body exactly ONCE — fix for TypeError: unusable
    const body = await request.json()
    const { credential } = body

    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        error("Missing Google credential"),
        { status: HTTP.BAD_REQUEST },
      )
    }

    logger.info("[Google Auth] Request received")
    logger.info("[Google Auth] Credential exists:", { value: Boolean(credential) })

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    // Verify the Google credential
    let userInfo: { email: string; name?: string; picture?: string }

    try {
      // Primary: verify as Google ID token (Google Identity Services / One Tap)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()
      if (!payload?.email) {
        return NextResponse.json(
          error("Google account has no email"),
          { status: HTTP.UNAUTHORIZED },
        )
      }
      userInfo = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }
    } catch {
      // Fallback: verify as access token via Google UserInfo API
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`,
      )
      if (!googleRes.ok) {
        const errorText = await googleRes.text()
        return NextResponse.json(
          error(`Google API verification failed: ${errorText.substring(0, 200)}`),
          { status: HTTP.UNAUTHORIZED },
        )
      }
      const data: { email?: string; name?: string; picture?: string } = await googleRes.json()
      if (!data.email) {
        return NextResponse.json(
          error("Google account has no email"),
          { status: HTTP.UNAUTHORIZED },
        )
      }
      userInfo = {
        email: data.email,
        name: data.name,
        picture: data.picture,
      }
    }

    logger.info("[Google Auth] Authenticated email:", userInfo.email)

    await connectDB()

    // Find existing user or create new one
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
    } else {
      // Update existing user's name/avatar if Google profile changed
      const updates: Record<string, unknown> = {}
      if (userInfo.name && user.name !== userInfo.name) {
        updates.name = userInfo.name
      }
      if (userInfo.picture && user.avatar !== userInfo.picture) {
        updates.avatar = userInfo.picture
      }
      if (Object.keys(updates).length > 0) {
        user =
          (await User.findByIdAndUpdate(user._id, { $set: updates }, { new: true, runValidators: true })) ?? user
      }
    }

    // Generate JWT using existing Pantry auth helpers
    const token = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Response format consistent with login/register routes
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

    // Cookie using existing AUTH_COOKIE_CONFIG (consistent with other auth routes)
    response.cookies.set(AUTH_COOKIE_CONFIG.name, token, {
      httpOnly: AUTH_COOKIE_CONFIG.httpOnly,
      secure: AUTH_COOKIE_CONFIG.secure,
      sameSite: AUTH_COOKIE_CONFIG.sameSite,
      path: AUTH_COOKIE_CONFIG.path,
      maxAge: AUTH_COOKIE_CONFIG.maxAge,
    })

    return response
  } catch (err) {
    logger.error("[Google Auth] Error:", err)
    return NextResponse.json(
      error(MESSAGES.INTERNAL_ERROR),
      { status: HTTP.INTERNAL_SERVER_ERROR },
    )
  }
}
