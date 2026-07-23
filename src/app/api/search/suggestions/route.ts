import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/repositories/product.repository";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";
import { connectDB } from "@/lib/db";

export type SearchSuggestion = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  brand?: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = (searchParams.get("q") ?? "").trim();

    if (!q) {
      return NextResponse.json(success([], MESSAGES.PRODUCTS_FETCHED), {
        status: HTTP.OK,
      });
    }

    if (q.length < 2) {
      return NextResponse.json(success([], MESSAGES.PRODUCTS_FETCHED), {
        status: HTTP.OK,
      });
    }

    const limitParam = searchParams.get("limit");
    const limit = Number(limitParam);
    const safeLimit =
      Number.isInteger(limit) && limit > 0 ? Math.min(limit, 10) : 5;

    await connectDB();

    const products = await productRepository.searchSuggestions(q, safeLimit);

    const suggestions: SearchSuggestion[] = products.map((p) => ({
      _id: String(p._id),
      title: p.title,
      slug: p.slug,
      price: p.price,
      discountPrice: p.discountPrice,
      images: p.images ?? [],
      brand: p.brand,
    }));

    return NextResponse.json(success(suggestions, MESSAGES.PRODUCTS_FETCHED), {
      status: HTTP.OK,
    });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
