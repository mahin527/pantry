import { NextRequest, NextResponse } from "next/server"
import { User } from "@/models"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/auth"
import { success, error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()
    console.log("[Google Auth] Request body keys:", Object.keys(await request.clone().json()))
    console.log("[Google Auth] credential exists:", !!credential)
    console.log("[Google Auth] credential starts with:", credential?.substring(0, 20))

    if (!credential) {
      return NextResponse.json(error("Google credential is required"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    // Fetch user info from Google's UserInfo API using the access token
    console.log("[Google Auth] Fetching user info from Google...")
    let userInfo: { email?: string; name?: string; picture?: string }
    try {
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`,
      )
      if (!googleRes.ok) {
        const errorText = await googleRes.text()
        console.error("[Google Auth] Google API error:", googleRes.status, errorText)
        return NextResponse.json(
          error(`Google API returned ${googleRes.status}: ${errorText.substring(0, 200)}`),
          { status: HTTP.UNAUTHORIZED },
        )
      }
      userInfo = await googleRes.json()
      console.log("[Google Auth] User info received. Email:", userInfo.email)
    } catch (err) {
      console.error("[Google Auth] Failed to fetch user info:", err)
      return NextResponse.json(
        error("Failed to verify Google token: " + (err instanceof Error ? err.message : String(err))),
        { status: HTTP.UNAUTHORIZED },
      )
    }

    if (!userInfo.email) {
      console.error("[Google Auth] No email in user info response")
      return NextResponse.json(error("Google account has no email"), {
        status: HTTP.UNAUTHORIZED,
      })
    }

    console.log("[Google Auth] Connecting to DB...")
    await connectDB()

    console.log("[Google Auth] Looking up user by email:", userInfo.email)
    let user = await User.findOne({ email: userInfo.email })

    if (!user) {
      console.log("[Google Auth] Creating new user...")
      try {
        user = await User.create({
          name: userInfo.name || userInfo.email.split("@")[0],
          email: userInfo.email,
          avatar: userInfo.picture || undefined,
          authProvider: "google",
          role: "user",
          isVerified: true,
          emailVerifiedAt: new Date(),
        })
        console.log("[Google Auth] User created:", user._id.toString())
      } catch (dbErr) {
        console.error("[Google Auth] User creation failed:", dbErr)
        return NextResponse.json(
          error("Database error: " + (dbErr instanceof Error ? dbErr.message : String(dbErr))),
          { status: HTTP.INTERNAL_SERVER_ERROR },
        )
      }
    } else {
      console.log("[Google Auth] Existing user found:", user._id.toString())
    }

    console.log("[Google Auth] Generating JWT...")
    let token: string
    try {
      token = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })
    } catch (jwtErr) {
      console.error("[Google Auth] JWT generation failed:", jwtErr)
      return NextResponse.json(
        error("Token generation failed: " + (jwtErr instanceof Error ? jwtErr.message : String(jwtErr))),
        { status: HTTP.INTERNAL_SERVER_ERROR },
      )
    }

    console.log("[Google Auth] Success. Redirecting user.")
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
    console.error("[Google Auth] Unhandled error:", err)
    return NextResponse.json(
      error("Google authentication failed: " + (err instanceof Error ? err.message : String(err))),
      { status: HTTP.INTERNAL_SERVER_ERROR },
    )
  }
}
