import { NextResponse } from "next/server";
import { categoryRepository } from "@/repositories/category.repository";
import { success, error } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { MESSAGES } from "@/lib/messages";
import { HTTP } from "@/lib/http-status";

export async function GET() {
  try {
    await connectDB();

    const categories = await categoryRepository.findActive();

    return NextResponse.json(success(categories, MESSAGES.CATEGORIES_FETCHED), {
      status: HTTP.OK,
    });
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
}
