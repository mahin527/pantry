import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";
import { error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { AUTH_COOKIE_CONFIG } from "@/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getUser(
  request: NextRequest,
): Promise<{ user: TokenPayload | null; response?: NextResponse }> {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value;
  if (!token) {
    return {
      user: null,
      response: NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED), {
        status: HTTP.UNAUTHORIZED,
      }),
    };
  }
  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch {
    return {
      user: null,
      response: NextResponse.json(error(MESSAGES.INVALID_TOKEN), {
        status: HTTP.UNAUTHORIZED,
      }),
    };
  }
}

export async function POST(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth.user) return auth.response!;

  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(error("Invalid amount"), {
        status: HTTP.BAD_REQUEST,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { userId: auth.user.userId },
    });

    return NextResponse.json(
      { success: true, clientSecret: paymentIntent.client_secret },
      { status: HTTP.CREATED },
    );
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}