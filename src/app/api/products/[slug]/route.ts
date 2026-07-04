import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/repositories/product.repository";
import { success, error } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    await connectDB();

    const product = await productRepository.findBySlug(slug);

    if (!product) {
      return NextResponse.json(error(MESSAGES.PRODUCT_NOT_FOUND), {
        status: HTTP.NOT_FOUND,
      });
    }

    return NextResponse.json(success(product, MESSAGES.PRODUCT_FETCHED), {
      status: HTTP.OK,
    });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
